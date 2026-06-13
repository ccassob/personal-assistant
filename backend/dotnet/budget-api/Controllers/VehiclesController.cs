using System.Security.Claims;
using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Authorize]
[Route("api/vehicles")]
public class VehiclesController(BudgetDbContext db) : ControllerBase
{
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    // ---- Vehicle CRUD ----

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Vehicles.Where(v => v.UserId == CurrentUserId).OrderBy(v => v.Name).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var vehicle = await db.Vehicles.FirstOrDefaultAsync(v => v.Id == id && v.UserId == CurrentUserId);
        return vehicle is null ? NotFound() : Ok(vehicle);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Vehicle vehicle)
    {
        vehicle.UserId = CurrentUserId;
        db.Vehicles.Add(vehicle);
        await db.SaveChangesAsync();
        await UpsertMileageHistory(vehicle.Id, vehicle.CurrentMileage);
        return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Vehicle vehicle)
    {
        if (id != vehicle.Id) return BadRequest();
        var existing = await db.Vehicles.FirstOrDefaultAsync(v => v.Id == id && v.UserId == CurrentUserId);
        if (existing is null) return NotFound();
        var oldMileage = existing.CurrentMileage;
        existing.Name = vehicle.Name;
        existing.Make = vehicle.Make;
        existing.Model = vehicle.Model;
        existing.Year = vehicle.Year;
        existing.LicensePlate = vehicle.LicensePlate;
        existing.CurrentMileage = vehicle.CurrentMileage;
        existing.Color = vehicle.Color;
        existing.Notes = vehicle.Notes;
        await db.SaveChangesAsync();
        if (existing.CurrentMileage != oldMileage)
            await UpsertMileageHistory(existing.Id, existing.CurrentMileage);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var vehicle = await db.Vehicles.FirstOrDefaultAsync(v => v.Id == id && v.UserId == CurrentUserId);
        if (vehicle is null) return NotFound();
        db.Vehicles.Remove(vehicle);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---- Maintenance ----

    [HttpGet("{id}/maintenance")]
    public async Task<IActionResult> GetMaintenance(int id)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        return Ok(await db.VehicleMaintenances
            .Where(m => m.VehicleId == id)
            .OrderByDescending(m => m.Date)
            .ToListAsync());
    }

    [HttpPost("{id}/maintenance")]
    public async Task<IActionResult> CreateMaintenance(int id, [FromBody] VehicleMaintenance record)
    {
        var vehicle = await db.Vehicles.FirstOrDefaultAsync(v => v.Id == id && v.UserId == CurrentUserId);
        if (vehicle is null) return NotFound();

        record.VehicleId = id;
        db.VehicleMaintenances.Add(record);
        await db.SaveChangesAsync();

        if (record.Mileage > vehicle.CurrentMileage)
        {
            vehicle.CurrentMileage = record.Mileage;
            await db.SaveChangesAsync();
            await UpsertMileageHistory(id, record.Mileage);
        }

        await UpsertReminder(id, record.Type, record.NextDate, record.NextMileage);
        return Ok(record);
    }

    [HttpPut("{id}/maintenance/{mid}")]
    public async Task<IActionResult> UpdateMaintenance(int id, int mid, [FromBody] VehicleMaintenance record)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        var existing = await db.VehicleMaintenances.FirstOrDefaultAsync(m => m.Id == mid && m.VehicleId == id);
        if (existing is null) return NotFound();

        existing.Date = record.Date;
        existing.Mileage = record.Mileage;
        existing.Type = record.Type;
        existing.Price = record.Price;
        existing.Notes = record.Notes;
        existing.NextDate = record.NextDate;
        existing.NextMileage = record.NextMileage;
        await db.SaveChangesAsync();

        await UpsertReminder(id, existing.Type, existing.NextDate, existing.NextMileage);
        return Ok(existing);
    }

    [HttpDelete("{id}/maintenance/{mid}")]
    public async Task<IActionResult> DeleteMaintenance(int id, int mid)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        var record = await db.VehicleMaintenances.FirstOrDefaultAsync(m => m.Id == mid && m.VehicleId == id);
        if (record is null) return NotFound();
        db.VehicleMaintenances.Remove(record);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---- Fuel ----

    [HttpGet("{id}/fuel")]
    public async Task<IActionResult> GetFuel(int id)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        return Ok(await db.VehicleFuels
            .Where(f => f.VehicleId == id)
            .OrderByDescending(f => f.Date)
            .ToListAsync());
    }

    [HttpPost("{id}/fuel")]
    public async Task<IActionResult> CreateFuel(int id, [FromBody] VehicleFuel record)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        record.VehicleId = id;
        record.Gallons = record.PricePerGallon != 0
            ? Math.Round(record.TotalAmount / record.PricePerGallon, 3)
            : 0;
        db.VehicleFuels.Add(record);
        await db.SaveChangesAsync();
        return Ok(record);
    }

    [HttpPut("{id}/fuel/{fid}")]
    public async Task<IActionResult> UpdateFuel(int id, int fid, [FromBody] VehicleFuel record)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        var existing = await db.VehicleFuels.FirstOrDefaultAsync(f => f.Id == fid && f.VehicleId == id);
        if (existing is null) return NotFound();
        existing.Date = record.Date;
        existing.PricePerGallon = record.PricePerGallon;
        existing.TotalAmount = record.TotalAmount;
        existing.Gallons = record.PricePerGallon != 0
            ? Math.Round(record.TotalAmount / record.PricePerGallon, 3)
            : 0;
        await db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}/fuel/{fid}")]
    public async Task<IActionResult> DeleteFuel(int id, int fid)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        var record = await db.VehicleFuels.FirstOrDefaultAsync(f => f.Id == fid && f.VehicleId == id);
        if (record is null) return NotFound();
        db.VehicleFuels.Remove(record);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---- Mileage History ----

    [HttpGet("{id}/mileage-history")]
    public async Task<IActionResult> GetMileageHistory(int id)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        return Ok(await db.VehicleMileageHistories
            .Where(h => h.VehicleId == id)
            .OrderBy(h => h.Date)
            .ToListAsync());
    }

    // ---- Todos ----

    [HttpGet("{id}/todos")]
    public async Task<IActionResult> GetTodos(int id)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        return Ok(await db.VehicleTodos.Where(t => t.VehicleId == id).OrderBy(t => t.Id).ToListAsync());
    }

    [HttpPost("{id}/todos")]
    public async Task<IActionResult> CreateTodo(int id, [FromBody] CreateChecklistItemRequest req)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        var todo = new VehicleTodo { VehicleId = id, Title = req.Title };
        db.VehicleTodos.Add(todo);
        await db.SaveChangesAsync();
        return Ok(todo);
    }

    [HttpPut("{id}/todos/{tid}")]
    public async Task<IActionResult> UpdateTodo(int id, int tid, [FromBody] UpdateChecklistItemRequest req)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        var todo = await db.VehicleTodos.FirstOrDefaultAsync(t => t.Id == tid && t.VehicleId == id);
        if (todo is null) return NotFound();
        todo.IsDone = req.IsDone;
        await db.SaveChangesAsync();
        return Ok(todo);
    }

    [HttpDelete("{id}/todos/{tid}")]
    public async Task<IActionResult> DeleteTodo(int id, int tid)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        var todo = await db.VehicleTodos.FirstOrDefaultAsync(t => t.Id == tid && t.VehicleId == id);
        if (todo is null) return NotFound();
        db.VehicleTodos.Remove(todo);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---- Reminders (auto-created from maintenance) ----

    [HttpGet("{id}/reminders")]
    public async Task<IActionResult> GetReminders(int id)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        return Ok(await db.VehicleReminders.Where(r => r.VehicleId == id).OrderBy(r => r.Id).ToListAsync());
    }

    [HttpPut("{id}/reminders/{rid}")]
    public async Task<IActionResult> UpdateReminder(int id, int rid, [FromBody] UpdateChecklistItemRequest req)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        var reminder = await db.VehicleReminders.FirstOrDefaultAsync(r => r.Id == rid && r.VehicleId == id);
        if (reminder is null) return NotFound();
        reminder.IsDone = req.IsDone;
        await db.SaveChangesAsync();
        return Ok(reminder);
    }

    [HttpDelete("{id}/reminders/{rid}")]
    public async Task<IActionResult> DeleteReminder(int id, int rid)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id && v.UserId == CurrentUserId)) return NotFound();
        var reminder = await db.VehicleReminders.FirstOrDefaultAsync(r => r.Id == rid && r.VehicleId == id);
        if (reminder is null) return NotFound();
        db.VehicleReminders.Remove(reminder);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---- Private helpers ----

    private async Task UpsertMileageHistory(int vehicleId, int mileage)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var existing = await db.VehicleMileageHistories
            .FirstOrDefaultAsync(h => h.VehicleId == vehicleId && h.Date == today);

        if (existing is null)
            db.VehicleMileageHistories.Add(new VehicleMileageHistory { VehicleId = vehicleId, Date = today, Mileage = mileage });
        else
            existing.Mileage = mileage;

        await db.SaveChangesAsync();
    }

    private async Task UpsertReminder(int vehicleId, string type, DateOnly? nextDate, int? nextMileage)
    {
        var existing = await db.VehicleReminders
            .FirstOrDefaultAsync(r => r.VehicleId == vehicleId && r.Type == type);

        if (nextDate == null && nextMileage == null)
        {
            if (existing != null) db.VehicleReminders.Remove(existing);
        }
        else
        {
            var parts = new List<string>();
            if (nextDate.HasValue)    parts.Add(nextDate.Value.ToString("yyyy-MM-dd"));
            if (nextMileage.HasValue) parts.Add($"{nextMileage}mi");
            var title = $"Next {type}: {string.Join(" / ", parts)}";

            if (existing is null)
                db.VehicleReminders.Add(new VehicleReminder { VehicleId = vehicleId, Type = type, Title = title, IsDone = false });
            else
            {
                existing.Title = title;
                existing.IsDone = false;
            }
        }

        await db.SaveChangesAsync();
    }
}

public record CreateChecklistItemRequest(string Title);
public record UpdateChecklistItemRequest(bool IsDone);
