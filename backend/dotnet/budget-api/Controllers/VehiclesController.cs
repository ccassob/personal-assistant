using budget_api.Data;
using budget_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace budget_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController(BudgetDbContext db) : ControllerBase
{
    // ---- Vehicle CRUD ----

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Vehicles.OrderBy(v => v.Name).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var vehicle = await db.Vehicles.FindAsync(id);
        return vehicle is null ? NotFound() : Ok(vehicle);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Vehicle vehicle)
    {
        db.Vehicles.Add(vehicle);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Vehicle vehicle)
    {
        if (id != vehicle.Id) return BadRequest();
        db.Entry(vehicle).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var vehicle = await db.Vehicles.FindAsync(id);
        if (vehicle is null) return NotFound();
        db.Vehicles.Remove(vehicle);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---- Maintenance ----

    [HttpGet("{id}/maintenance")]
    public async Task<IActionResult> GetMaintenance(int id) =>
        Ok(await db.VehicleMaintenances
            .Where(m => m.VehicleId == id)
            .OrderByDescending(m => m.Date)
            .ToListAsync());

    [HttpPost("{id}/maintenance")]
    public async Task<IActionResult> CreateMaintenance(int id, [FromBody] VehicleMaintenance record)
    {
        var vehicle = await db.Vehicles.FindAsync(id);
        if (vehicle is null) return NotFound();

        record.VehicleId = id;
        db.VehicleMaintenances.Add(record);
        await db.SaveChangesAsync();

        if (record.Mileage > vehicle.CurrentMileage)
        {
            vehicle.CurrentMileage = record.Mileage;
            await db.SaveChangesAsync();
        }

        return Ok(record);
    }

    [HttpPut("{id}/maintenance/{mid}")]
    public async Task<IActionResult> UpdateMaintenance(int id, int mid, [FromBody] VehicleMaintenance record)
    {
        var existing = await db.VehicleMaintenances.FirstOrDefaultAsync(m => m.Id == mid && m.VehicleId == id);
        if (existing is null) return NotFound();

        existing.Date = record.Date;
        existing.Mileage = record.Mileage;
        existing.Type = record.Type;
        existing.Location = record.Location;
        existing.Price = record.Price;
        existing.Mechanic = record.Mechanic;
        existing.Notes = record.Notes;
        existing.NextDate = record.NextDate;
        existing.NextMileage = record.NextMileage;
        await db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}/maintenance/{mid}")]
    public async Task<IActionResult> DeleteMaintenance(int id, int mid)
    {
        var record = await db.VehicleMaintenances.FirstOrDefaultAsync(m => m.Id == mid && m.VehicleId == id);
        if (record is null) return NotFound();
        db.VehicleMaintenances.Remove(record);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---- Todos ----

    [HttpGet("{id}/todos")]
    public async Task<IActionResult> GetTodos(int id) =>
        Ok(await db.VehicleTodos.Where(t => t.VehicleId == id).OrderBy(t => t.Id).ToListAsync());

    [HttpPost("{id}/todos")]
    public async Task<IActionResult> CreateTodo(int id, [FromBody] CreateChecklistItemRequest req)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id)) return NotFound();
        var todo = new VehicleTodo { VehicleId = id, Title = req.Title };
        db.VehicleTodos.Add(todo);
        await db.SaveChangesAsync();
        return Ok(todo);
    }

    [HttpPut("{id}/todos/{tid}")]
    public async Task<IActionResult> UpdateTodo(int id, int tid, [FromBody] UpdateChecklistItemRequest req)
    {
        var todo = await db.VehicleTodos.FirstOrDefaultAsync(t => t.Id == tid && t.VehicleId == id);
        if (todo is null) return NotFound();
        todo.IsDone = req.IsDone;
        await db.SaveChangesAsync();
        return Ok(todo);
    }

    [HttpDelete("{id}/todos/{tid}")]
    public async Task<IActionResult> DeleteTodo(int id, int tid)
    {
        var todo = await db.VehicleTodos.FirstOrDefaultAsync(t => t.Id == tid && t.VehicleId == id);
        if (todo is null) return NotFound();
        db.VehicleTodos.Remove(todo);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---- Reminders ----

    [HttpGet("{id}/reminders")]
    public async Task<IActionResult> GetReminders(int id) =>
        Ok(await db.VehicleReminders.Where(r => r.VehicleId == id).OrderBy(r => r.Id).ToListAsync());

    [HttpPost("{id}/reminders")]
    public async Task<IActionResult> CreateReminder(int id, [FromBody] CreateChecklistItemRequest req)
    {
        if (!await db.Vehicles.AnyAsync(v => v.Id == id)) return NotFound();
        var reminder = new VehicleReminder { VehicleId = id, Title = req.Title };
        db.VehicleReminders.Add(reminder);
        await db.SaveChangesAsync();
        return Ok(reminder);
    }

    [HttpPut("{id}/reminders/{rid}")]
    public async Task<IActionResult> UpdateReminder(int id, int rid, [FromBody] UpdateChecklistItemRequest req)
    {
        var reminder = await db.VehicleReminders.FirstOrDefaultAsync(r => r.Id == rid && r.VehicleId == id);
        if (reminder is null) return NotFound();
        reminder.IsDone = req.IsDone;
        await db.SaveChangesAsync();
        return Ok(reminder);
    }

    [HttpDelete("{id}/reminders/{rid}")]
    public async Task<IActionResult> DeleteReminder(int id, int rid)
    {
        var reminder = await db.VehicleReminders.FirstOrDefaultAsync(r => r.Id == rid && r.VehicleId == id);
        if (reminder is null) return NotFound();
        db.VehicleReminders.Remove(reminder);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateChecklistItemRequest(string Title);
public record UpdateChecklistItemRequest(bool IsDone);
