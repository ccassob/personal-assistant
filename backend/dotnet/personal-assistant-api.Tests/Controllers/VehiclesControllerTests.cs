using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class VehiclesControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public VehiclesControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private static DateOnly Today => DateOnly.FromDateTime(DateTime.Today);

    private int SeedVehicle(string name = "Civic", int mileage = 10000, string userId = TestAuthHandler.UserId)
    {
        return _factory.Seed(new Vehicle
        {
            Name = name,
            Make = "Honda",
            Model = "Civic",
            Year = 2020,
            CurrentMileage = mileage,
            LicensePlate = "ABC123",
            Color = "Blue",
            Notes = "n",
            UserId = userId,
        });
    }

    private static VehicleMaintenance Maint(
        string type = "Oil",
        int mileage = 12000,
        string date = "2026-03-10",
        DateOnly? nextDate = null,
        int? nextMileage = null)
    {
        return new VehicleMaintenance
        {
            Type = type,
            Mileage = mileage,
            Date = DateOnly.Parse(date),
            Price = 50m,
            Notes = "n",
            NextDate = nextDate,
            NextMileage = nextMileage,
        };
    }

    // ── Vehicle CRUD ────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_OrdersByName_AndExcludesOtherUsers()
    {
        SeedVehicle("Truck");
        SeedVehicle("Civic");
        SeedVehicle("Theirs", userId: OtherUserId);

        var vehicles = await _client.GetFromJsonAsync<Vehicle[]>("/api/vehicles");

        vehicles!.Select(v => v.Name).Should().Equal("Civic", "Truck");
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenOwnedByAnotherUser()
    {
        var id = SeedVehicle("Theirs", userId: OtherUserId);

        var response = await _client.GetAsync($"/api/vehicles/{id}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_AssignsUserIdFromClaim_AndWritesTodaysMileageHistory()
    {
        var before = Today;
        var payload = new Vehicle { Name = "New", Make = "Ford", Model = "F150", Year = 2022, CurrentMileage = 500, UserId = OtherUserId };

        var response = await _client.PostAsJsonAsync("/api/vehicles", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var saved = _factory.GetAll<Vehicle>().Single();
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        var history = _factory.GetAll<VehicleMileageHistory>().Single();
        history.VehicleId.Should().Be(saved.Id);
        history.Mileage.Should().Be(500);
        history.Date.Should().BeOneOf(before, Today);
    }

    [Fact]
    public async Task Update_PersistsFields_AndUpsertsMileageHistory_WhenMileageChanges()
    {
        var id = SeedVehicle("Old", 10000);
        var payload = new Vehicle
        {
            Id = id, Name = "New", Make = "Toyota", Model = "Corolla", Year = 2021,
            CurrentMileage = 11000, LicensePlate = "XYZ", Color = "Red", Notes = "changed",
        };

        var response = await _client.PutAsJsonAsync($"/api/vehicles/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var saved = _factory.GetAll<Vehicle>().Single();
        saved.Name.Should().Be("New");
        saved.Make.Should().Be("Toyota");
        saved.Year.Should().Be(2021);
        saved.CurrentMileage.Should().Be(11000);
        saved.LicensePlate.Should().Be("XYZ");
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        _factory.GetAll<VehicleMileageHistory>().Single().Mileage.Should().Be(11000);
    }

    [Fact]
    public async Task Update_DoesNotWriteMileageHistory_WhenMileageIsUnchanged()
    {
        var id = SeedVehicle("Old", 10000);

        await _client.PutAsJsonAsync($"/api/vehicles/{id}", new Vehicle { Id = id, Name = "Renamed", CurrentMileage = 10000 });

        _factory.CountAll<VehicleMileageHistory>().Should().Be(0);
    }

    [Fact]
    public async Task Update_TwiceInSameDay_KeepsSingleMileageHistoryRow()
    {
        var id = SeedVehicle("Car", 10000);

        await _client.PutAsJsonAsync($"/api/vehicles/{id}", new Vehicle { Id = id, Name = "Car", CurrentMileage = 10100 });
        await _client.PutAsJsonAsync($"/api/vehicles/{id}", new Vehicle { Id = id, Name = "Car", CurrentMileage = 10200 });

        _factory.GetAll<VehicleMileageHistory>().Single().Mileage.Should().Be(10200);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var response = await _client.PutAsJsonAsync("/api/vehicles/1", new Vehicle { Id = 99 });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_AndKeepsData_WhenOwnedByAnotherUser()
    {
        var id = SeedVehicle("Theirs", 10000, OtherUserId);

        var response = await _client.PutAsJsonAsync($"/api/vehicles/{id}", new Vehicle { Id = id, Name = "Hijacked", CurrentMileage = 1 });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<Vehicle>().Single().Name.Should().Be("Theirs");
    }

    [Fact]
    public async Task Delete_RemovesOwnedVehicle_AndReturnsNotFoundForOthers()
    {
        var mine = SeedVehicle("Mine");
        var theirs = SeedVehicle("Theirs", userId: OtherUserId);

        var ok = await _client.DeleteAsync($"/api/vehicles/{mine}");
        var notFound = await _client.DeleteAsync($"/api/vehicles/{theirs}");

        ok.StatusCode.Should().Be(HttpStatusCode.NoContent);
        notFound.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<Vehicle>().Single().UserId.Should().Be(OtherUserId);
    }

    // ── Ownership of nested resources ───────────────────────────────────────

    [Theory]
    [InlineData("maintenance")]
    [InlineData("fuel")]
    [InlineData("mileage-history")]
    [InlineData("todos")]
    [InlineData("reminders")]
    public async Task NestedGet_ReturnsNotFound_WhenVehicleOwnedByAnotherUser(string resource)
    {
        var id = SeedVehicle("Theirs", userId: OtherUserId);

        var response = await _client.GetAsync($"/api/vehicles/{id}/{resource}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task NestedPost_ReturnsNotFound_AndSavesNothing_WhenVehicleOwnedByAnotherUser()
    {
        var id = SeedVehicle("Theirs", userId: OtherUserId);

        var maintenance = await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance", Maint(nextMileage: 5000));
        var fuel = await _client.PostAsJsonAsync($"/api/vehicles/{id}/fuel", new VehicleFuel { PricePerGallon = 3m, TotalAmount = 30m });
        var todo = await _client.PostAsJsonAsync($"/api/vehicles/{id}/todos", new { title = "x" });

        maintenance.StatusCode.Should().Be(HttpStatusCode.NotFound);
        fuel.StatusCode.Should().Be(HttpStatusCode.NotFound);
        todo.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.CountAll<VehicleMaintenance>().Should().Be(0);
        _factory.CountAll<VehicleFuel>().Should().Be(0);
        _factory.CountAll<VehicleTodo>().Should().Be(0);
        _factory.CountAll<VehicleReminder>().Should().Be(0);
    }

    // ── Maintenance ─────────────────────────────────────────────────────────

    [Fact]
    public async Task GetMaintenance_OrdersByDateDescending_ForThatVehicleOnly()
    {
        var id = SeedVehicle();
        var other = SeedVehicle("Other");
        _factory.SeedMany([
            new VehicleMaintenance { VehicleId = id, Type = "old", Date = new DateOnly(2026, 1, 1) },
            new VehicleMaintenance { VehicleId = id, Type = "new", Date = new DateOnly(2026, 3, 1) },
            new VehicleMaintenance { VehicleId = other, Type = "elsewhere", Date = new DateOnly(2026, 2, 1) },
        ]);

        var rows = await _client.GetFromJsonAsync<VehicleMaintenance[]>($"/api/vehicles/{id}/maintenance");

        rows!.Select(r => r.Type).Should().Equal("new", "old");
    }

    [Fact]
    public async Task CreateMaintenance_SetsVehicleIdFromRoute_IgnoringPayload()
    {
        var id = SeedVehicle();
        var payload = Maint();
        payload.VehicleId = 9999;

        var response = await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance", payload);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        _factory.GetAll<VehicleMaintenance>().Single().VehicleId.Should().Be(id);
    }

    [Fact]
    public async Task CreateMaintenance_RaisesVehicleMileage_AndWritesHistory_WhenMileageIsHigher()
    {
        var id = SeedVehicle(mileage: 10000);

        await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance", Maint(mileage: 12500));

        _factory.GetAll<Vehicle>().Single().CurrentMileage.Should().Be(12500);
        _factory.GetAll<VehicleMileageHistory>().Single().Mileage.Should().Be(12500);
    }

    [Theory]
    [InlineData(9000)]
    [InlineData(10000)]
    public async Task CreateMaintenance_KeepsVehicleMileage_WhenMileageIsNotHigher(int mileage)
    {
        var id = SeedVehicle(mileage: 10000);

        await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance", Maint(mileage: mileage));

        _factory.GetAll<Vehicle>().Single().CurrentMileage.Should().Be(10000);
        _factory.CountAll<VehicleMileageHistory>().Should().Be(0);
    }

    [Fact]
    public async Task CreateMaintenance_CreatesReminder_WithDateAndMileageInTitle()
    {
        var id = SeedVehicle();

        await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance",
            Maint("Oil", nextDate: new DateOnly(2026, 9, 1), nextMileage: 15000));

        var reminder = _factory.GetAll<VehicleReminder>().Single();
        reminder.VehicleId.Should().Be(id);
        reminder.Type.Should().Be("Oil");
        reminder.Title.Should().Be("Next Oil: 2026-09-01 / 15000mi");
        reminder.IsDone.Should().BeFalse();
    }

    [Fact]
    public async Task CreateMaintenance_ReminderTitleUsesOnlyTheProvidedParts()
    {
        var id = SeedVehicle();

        await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance", Maint("Tires", nextMileage: 40000));
        await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance", Maint("Brakes", nextDate: new DateOnly(2027, 1, 15)));

        var titles = _factory.GetAll<VehicleReminder>().ToDictionary(r => r.Type, r => r.Title);
        titles["Tires"].Should().Be("Next Tires: 40000mi");
        titles["Brakes"].Should().Be("Next Brakes: 2027-01-15");
    }

    [Fact]
    public async Task CreateMaintenance_WithoutNextValues_CreatesNoReminder()
    {
        var id = SeedVehicle();

        await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance", Maint());

        _factory.CountAll<VehicleReminder>().Should().Be(0);
    }

    [Fact]
    public async Task CreateMaintenance_ReusesReminderOfSameType_ResettingIsDone()
    {
        var id = SeedVehicle();
        _factory.Seed(new VehicleReminder { VehicleId = id, Type = "Oil", Title = "stale", IsDone = true });

        await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance", Maint("Oil", nextMileage: 20000));

        var reminder = _factory.GetAll<VehicleReminder>().Single();
        reminder.Title.Should().Be("Next Oil: 20000mi");
        reminder.IsDone.Should().BeFalse();
    }

    [Fact]
    public async Task CreateMaintenance_WithoutNextValues_RemovesExistingReminderOfSameType_ButKeepsOtherTypes()
    {
        var id = SeedVehicle();
        _factory.SeedMany([
            new VehicleReminder { VehicleId = id, Type = "Oil", Title = "Next Oil: 1mi" },
            new VehicleReminder { VehicleId = id, Type = "Tires", Title = "Next Tires: 2mi" },
        ]);

        await _client.PostAsJsonAsync($"/api/vehicles/{id}/maintenance", Maint("Oil"));

        _factory.GetAll<VehicleReminder>().Single().Type.Should().Be("Tires");
    }

    [Fact]
    public async Task UpdateMaintenance_PersistsFields_AndRefreshesReminder()
    {
        var id = SeedVehicle();
        var mid = _factory.Seed(new VehicleMaintenance { VehicleId = id, Type = "Oil", Date = new DateOnly(2026, 1, 1), Mileage = 100 });
        var payload = Maint("Oil", 200, "2026-02-02", nextMileage: 7000);
        payload.Price = 80m;

        var response = await _client.PutAsJsonAsync($"/api/vehicles/{id}/maintenance/{mid}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var saved = _factory.GetAll<VehicleMaintenance>().Single();
        saved.Mileage.Should().Be(200);
        saved.Date.Should().Be(new DateOnly(2026, 2, 2));
        saved.Price.Should().Be(80m);
        saved.NextMileage.Should().Be(7000);
        _factory.GetAll<VehicleReminder>().Single().Title.Should().Be("Next Oil: 7000mi");
    }

    [Fact]
    public async Task UpdateMaintenance_ReturnsNotFound_WhenRecordBelongsToAnotherVehicle()
    {
        var mine = SeedVehicle("Mine");
        var other = SeedVehicle("Other");
        var mid = _factory.Seed(new VehicleMaintenance { VehicleId = other, Type = "Oil", Date = new DateOnly(2026, 1, 1) });

        var response = await _client.PutAsJsonAsync($"/api/vehicles/{mine}/maintenance/{mid}", Maint("Hijack"));

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<VehicleMaintenance>().Single().Type.Should().Be("Oil");
    }

    [Fact]
    public async Task UpdateAndDeleteMaintenance_ReturnNotFound_WhenVehicleOwnedByAnotherUser()
    {
        var theirs = SeedVehicle("Theirs", userId: OtherUserId);
        var mid = _factory.Seed(new VehicleMaintenance { VehicleId = theirs, Type = "Oil", Date = new DateOnly(2026, 1, 1) });

        var put = await _client.PutAsJsonAsync($"/api/vehicles/{theirs}/maintenance/{mid}", Maint("Hijack"));
        var delete = await _client.DeleteAsync($"/api/vehicles/{theirs}/maintenance/{mid}");

        put.StatusCode.Should().Be(HttpStatusCode.NotFound);
        delete.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<VehicleMaintenance>().Single().Type.Should().Be("Oil");
    }

    [Fact]
    public async Task DeleteMaintenance_RemovesRecord_ButKeepsItsReminder()
    {
        var id = SeedVehicle();
        var mid = _factory.Seed(new VehicleMaintenance { VehicleId = id, Type = "Oil", Date = new DateOnly(2026, 1, 1) });
        _factory.Seed(new VehicleReminder { VehicleId = id, Type = "Oil", Title = "Next Oil: 5000mi" });

        var response = await _client.DeleteAsync($"/api/vehicles/{id}/maintenance/{mid}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.CountAll<VehicleMaintenance>().Should().Be(0);
        _factory.CountAll<VehicleReminder>().Should().Be(1);
    }

    // ── Fuel ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task CreateFuel_ComputesGallonsRoundedToThreeDecimals()
    {
        var id = SeedVehicle();

        var response = await _client.PostAsJsonAsync($"/api/vehicles/{id}/fuel",
            new VehicleFuel { Date = new DateOnly(2026, 3, 1), PricePerGallon = 3m, TotalAmount = 10m, Gallons = 999m });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var saved = _factory.GetAll<VehicleFuel>().Single();
        saved.VehicleId.Should().Be(id);
        saved.Gallons.Should().Be(3.333m);
    }

    [Fact]
    public async Task CreateFuel_SetsGallonsToZero_WhenPriceIsZero()
    {
        var id = SeedVehicle();

        await _client.PostAsJsonAsync($"/api/vehicles/{id}/fuel", new VehicleFuel { PricePerGallon = 0m, TotalAmount = 10m, Gallons = 5m });

        _factory.GetAll<VehicleFuel>().Single().Gallons.Should().Be(0m);
    }

    [Fact]
    public async Task GetFuel_OrdersByDateDescending_ForThatVehicleOnly()
    {
        var id = SeedVehicle();
        var other = SeedVehicle("Other");
        _factory.SeedMany([
            new VehicleFuel { VehicleId = id, Date = new DateOnly(2026, 1, 1), TotalAmount = 1m },
            new VehicleFuel { VehicleId = id, Date = new DateOnly(2026, 3, 1), TotalAmount = 3m },
            new VehicleFuel { VehicleId = other, Date = new DateOnly(2026, 2, 1), TotalAmount = 2m },
        ]);

        var rows = await _client.GetFromJsonAsync<VehicleFuel[]>($"/api/vehicles/{id}/fuel");

        rows!.Select(r => r.TotalAmount).Should().Equal(3m, 1m);
    }

    [Fact]
    public async Task UpdateFuel_PersistsFields_AndRecomputesGallons()
    {
        var id = SeedVehicle();
        var fid = _factory.Seed(new VehicleFuel { VehicleId = id, Date = new DateOnly(2026, 1, 1), PricePerGallon = 2m, TotalAmount = 20m, Gallons = 10m });

        var response = await _client.PutAsJsonAsync($"/api/vehicles/{id}/fuel/{fid}",
            new VehicleFuel { Date = new DateOnly(2026, 2, 2), PricePerGallon = 4m, TotalAmount = 30m });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var saved = _factory.GetAll<VehicleFuel>().Single();
        saved.Date.Should().Be(new DateOnly(2026, 2, 2));
        saved.PricePerGallon.Should().Be(4m);
        saved.TotalAmount.Should().Be(30m);
        saved.Gallons.Should().Be(7.5m);
    }

    [Fact]
    public async Task UpdateAndDeleteFuel_ReturnNotFound_WhenRecordBelongsToAnotherVehicle()
    {
        var mine = SeedVehicle("Mine");
        var other = SeedVehicle("Other");
        var fid = _factory.Seed(new VehicleFuel { VehicleId = other, TotalAmount = 5m, PricePerGallon = 1m });

        var put = await _client.PutAsJsonAsync($"/api/vehicles/{mine}/fuel/{fid}", new VehicleFuel { TotalAmount = 1m });
        var delete = await _client.DeleteAsync($"/api/vehicles/{mine}/fuel/{fid}");

        put.StatusCode.Should().Be(HttpStatusCode.NotFound);
        delete.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<VehicleFuel>().Single().TotalAmount.Should().Be(5m);
    }

    [Fact]
    public async Task DeleteFuel_RemovesRecord()
    {
        var id = SeedVehicle();
        var fid = _factory.Seed(new VehicleFuel { VehicleId = id, TotalAmount = 5m });

        var response = await _client.DeleteAsync($"/api/vehicles/{id}/fuel/{fid}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.CountAll<VehicleFuel>().Should().Be(0);
    }

    // ── Mileage history ─────────────────────────────────────────────────────

    [Fact]
    public async Task GetMileageHistory_OrdersByDateAscending_ForThatVehicleOnly()
    {
        var id = SeedVehicle();
        var other = SeedVehicle("Other");
        _factory.SeedMany([
            new VehicleMileageHistory { VehicleId = id, Date = new DateOnly(2026, 3, 1), Mileage = 300 },
            new VehicleMileageHistory { VehicleId = id, Date = new DateOnly(2026, 1, 1), Mileage = 100 },
            new VehicleMileageHistory { VehicleId = other, Date = new DateOnly(2026, 2, 1), Mileage = 999 },
        ]);

        var rows = await _client.GetFromJsonAsync<VehicleMileageHistory[]>($"/api/vehicles/{id}/mileage-history");

        rows!.Select(r => r.Mileage).Should().Equal(100, 300);
    }

    // ── Todos ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task Todos_CreateListUpdateDelete_RoundTrip()
    {
        var id = SeedVehicle();

        var created = await _client.PostAsJsonAsync($"/api/vehicles/{id}/todos", new { title = "Wash car" });
        await _client.PostAsJsonAsync($"/api/vehicles/{id}/todos", new { title = "Change wipers" });
        var todo = await created.Content.ReadFromJsonAsync<VehicleTodo>();
        todo!.IsDone.Should().BeFalse();

        var put = await _client.PutAsJsonAsync($"/api/vehicles/{id}/todos/{todo.Id}", new { isDone = true });
        var listed = await _client.GetFromJsonAsync<VehicleTodo[]>($"/api/vehicles/{id}/todos");

        put.StatusCode.Should().Be(HttpStatusCode.OK);
        listed!.Select(t => (t.Title, t.IsDone)).Should().Equal(("Wash car", true), ("Change wipers", false));

        var delete = await _client.DeleteAsync($"/api/vehicles/{id}/todos/{todo.Id}");
        delete.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.GetAll<VehicleTodo>().Single().Title.Should().Be("Change wipers");
    }

    [Fact]
    public async Task UpdateAndDeleteTodo_ReturnNotFound_WhenTodoBelongsToAnotherVehicle()
    {
        var mine = SeedVehicle("Mine");
        var other = SeedVehicle("Other");
        var tid = _factory.Seed(new VehicleTodo { VehicleId = other, Title = "theirs" });

        var put = await _client.PutAsJsonAsync($"/api/vehicles/{mine}/todos/{tid}", new { isDone = true });
        var delete = await _client.DeleteAsync($"/api/vehicles/{mine}/todos/{tid}");

        put.StatusCode.Should().Be(HttpStatusCode.NotFound);
        delete.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var saved = _factory.GetAll<VehicleTodo>().Single();
        saved.IsDone.Should().BeFalse();
    }

    // ── Reminders ───────────────────────────────────────────────────────────

    [Fact]
    public async Task Reminders_ListUpdateDelete_RoundTrip()
    {
        var id = SeedVehicle();
        var rid = _factory.Seed(new VehicleReminder { VehicleId = id, Type = "Oil", Title = "Next Oil: 5000mi" });

        var listed = await _client.GetFromJsonAsync<VehicleReminder[]>($"/api/vehicles/{id}/reminders");
        var put = await _client.PutAsJsonAsync($"/api/vehicles/{id}/reminders/{rid}", new { isDone = true });

        listed!.Should().ContainSingle().Which.IsDone.Should().BeFalse();
        put.StatusCode.Should().Be(HttpStatusCode.OK);
        _factory.GetAll<VehicleReminder>().Single().IsDone.Should().BeTrue();

        var delete = await _client.DeleteAsync($"/api/vehicles/{id}/reminders/{rid}");
        delete.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _factory.CountAll<VehicleReminder>().Should().Be(0);
    }

    [Fact]
    public async Task UpdateAndDeleteReminder_ReturnNotFound_WhenVehicleOwnedByAnotherUser()
    {
        var theirs = SeedVehicle("Theirs", userId: OtherUserId);
        var rid = _factory.Seed(new VehicleReminder { VehicleId = theirs, Type = "Oil", Title = "t" });

        var put = await _client.PutAsJsonAsync($"/api/vehicles/{theirs}/reminders/{rid}", new { isDone = true });
        var delete = await _client.DeleteAsync($"/api/vehicles/{theirs}/reminders/{rid}");

        put.StatusCode.Should().Be(HttpStatusCode.NotFound);
        delete.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<VehicleReminder>().Single().IsDone.Should().BeFalse();
    }
}
