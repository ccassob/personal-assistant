using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PersonalAssistant.Api.Controllers;
using PersonalAssistant.Api.Models;

namespace PersonalAssistant.Tests.Controllers;

public class GroceryItemsControllerTests : IClassFixture<PersonalAssistantApiFactory>
{
    private const string OtherUserId = "other-user";

    private readonly HttpClient _client;
    private readonly PersonalAssistantApiFactory _factory;

    public GroceryItemsControllerTests(PersonalAssistantApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        factory.ResetDatabase();
    }

    private int SeedItem(string name = "Milk", bool isOnList = false, string userId = TestAuthHandler.UserId)
    {
        return _factory.Seed(new GroceryItem { Name = name, UnitType = "Units", IsOnList = isOnList, UserId = userId });
    }

    private int SeedSupermarket(string name = "Costco", string userId = TestAuthHandler.UserId)
    {
        return _factory.Seed(new Supermarket { Name = name, UserId = userId });
    }

    // GroceryItemSupermarket has a composite key, so it goes through SeedMany (Seed<T> reads an "Id" property).
    private void Link(int itemId, params int[] supermarketIds)
    {
        _factory.SeedMany(supermarketIds.Select(s => new GroceryItemSupermarket { GroceryItemId = itemId, SupermarketId = s }));
    }

    private int[] LinkedSupermarkets(int itemId)
    {
        return _factory.GetAll<GroceryItemSupermarket>()
            .Where(x => x.GroceryItemId == itemId)
            .Select(x => x.SupermarketId)
            .OrderBy(x => x)
            .ToArray();
    }

    // ── GET ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_OrdersByName_PopulatesSupermarketIds_AndExcludesOtherUsers()
    {
        var costco = SeedSupermarket("Costco");
        var walmart = SeedSupermarket("Walmart");
        var milk = SeedItem("Milk");
        SeedItem("Apples");
        SeedItem("Theirs", userId: OtherUserId);
        Link(milk, costco, walmart);

        var items = await _client.GetFromJsonAsync<GroceryItem[]>("/api/grocery-items");

        items!.Select(i => i.Name).Should().Equal("Apples", "Milk");
        items.Single(i => i.Name == "Milk").SupermarketIds.Should().BeEquivalentTo([costco, walmart]);
        items.Single(i => i.Name == "Apples").SupermarketIds.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAll_FiltersByOnList()
    {
        SeedItem("OnList", isOnList: true);
        SeedItem("Off", isOnList: false);

        var onList = await _client.GetFromJsonAsync<GroceryItem[]>("/api/grocery-items?onList=true");
        var all = await _client.GetFromJsonAsync<GroceryItem[]>("/api/grocery-items?onList=false");

        onList!.Select(i => i.Name).Should().Equal("OnList");
        all!.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetAll_FiltersBySupermarket()
    {
        var costco = SeedSupermarket("Costco");
        var walmart = SeedSupermarket("Walmart");
        Link(SeedItem("AtCostco"), costco);
        Link(SeedItem("AtBoth"), costco, walmart);
        SeedItem("Nowhere");

        var items = await _client.GetFromJsonAsync<GroceryItem[]>($"/api/grocery-items?supermarketId={walmart}");

        items!.Select(i => i.Name).Should().Equal("AtBoth");
    }

    [Fact]
    public async Task GetById_ReturnsItemWithSupermarketIds_AndNotFoundForOtherUsers()
    {
        var costco = SeedSupermarket();
        var mine = SeedItem("Mine");
        Link(mine, costco);
        var theirs = SeedItem("Theirs", userId: OtherUserId);

        var item = await _client.GetFromJsonAsync<GroceryItem>($"/api/grocery-items/{mine}");
        var response = await _client.GetAsync($"/api/grocery-items/{theirs}");

        item!.SupermarketIds.Should().Equal(costco);
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ── POST / PUT / DELETE ─────────────────────────────────────────────────

    [Fact]
    public async Task Create_AssignsUserId_AndPersistsSupermarketLinks()
    {
        var costco = SeedSupermarket("Costco");
        var walmart = SeedSupermarket("Walmart");
        var payload = new GroceryItem { Name = "Rice", UnitType = "Lbs", Barcode = "123", Manufacturer = "Acme", UserId = OtherUserId, SupermarketIds = [costco, walmart] };

        var response = await _client.PostAsJsonAsync("/api/grocery-items", payload);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var saved = _factory.GetAll<GroceryItem>().Single();
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        saved.UnitType.Should().Be("Lbs");
        saved.Barcode.Should().Be("123");
        LinkedSupermarkets(saved.Id).Should().Equal(costco, walmart);
    }

    [Fact]
    public async Task Update_PersistsFields_AndReplacesSupermarketLinks()
    {
        var costco = SeedSupermarket("Costco");
        var walmart = SeedSupermarket("Walmart");
        var id = SeedItem("Old");
        Link(id, costco);
        var payload = new GroceryItem { Id = id, Name = "New", UnitType = "Lbs", Barcode = "999", Manufacturer = "M", IsOnList = true, SupermarketIds = [walmart] };

        var response = await _client.PutAsJsonAsync($"/api/grocery-items/{id}", payload);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var saved = _factory.GetAll<GroceryItem>().Single();
        saved.Name.Should().Be("New");
        saved.UnitType.Should().Be("Lbs");
        saved.Barcode.Should().Be("999");
        saved.IsOnList.Should().BeTrue();
        saved.UserId.Should().Be(TestAuthHandler.UserId);
        LinkedSupermarkets(id).Should().Equal(walmart);
    }

    [Fact]
    public async Task Update_KeepsLinks_WhenSupermarketIdsAreUnchanged()
    {
        var costco = SeedSupermarket("Costco");
        var id = SeedItem("Milk");
        Link(id, costco);

        var response = await _client.PutAsJsonAsync($"/api/grocery-items/{id}",
            new GroceryItem { Id = id, Name = "Milk 2", SupermarketIds = [costco] });

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        LinkedSupermarkets(id).Should().Equal(costco);
    }

    [Fact]
    public async Task Update_ClearsLinks_WhenSupermarketIdsIsEmpty()
    {
        var costco = SeedSupermarket();
        var id = SeedItem();
        Link(id, costco);

        await _client.PutAsJsonAsync($"/api/grocery-items/{id}", new GroceryItem { Id = id, Name = "Milk", SupermarketIds = [] });

        LinkedSupermarkets(id).Should().BeEmpty();
    }

    [Fact]
    public async Task Update_DoesNotChangePurchaseSnapshotFields()
    {
        var costco = SeedSupermarket();
        var id = _factory.Seed(new GroceryItem
        {
            Name = "Milk", LastPrice = 3m, LastQuantity = 2m, LastSupermarketId = costco, UserId = TestAuthHandler.UserId,
        });

        await _client.PutAsJsonAsync($"/api/grocery-items/{id}", new GroceryItem { Id = id, Name = "Milk", LastPrice = 99m });

        var saved = _factory.GetAll<GroceryItem>().Single();
        saved.LastPrice.Should().Be(3m);
        saved.LastQuantity.Should().Be(2m);
        saved.LastSupermarketId.Should().Be(costco);
    }

    [Fact]
    public async Task Update_ReturnsBadRequest_WhenIdMismatch()
    {
        var response = await _client.PutAsJsonAsync("/api/grocery-items/1", new GroceryItem { Id = 99 });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_AndKeepsData_WhenOwnedByAnotherUser()
    {
        var id = SeedItem("Theirs", userId: OtherUserId);

        var response = await _client.PutAsJsonAsync($"/api/grocery-items/{id}", new GroceryItem { Id = id, Name = "Hijacked" });

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<GroceryItem>().Single().Name.Should().Be("Theirs");
    }

    [Fact]
    public async Task Delete_RemovesOwnedItem_AndReturnsNotFoundForOthers()
    {
        var mine = SeedItem("Mine");
        var theirs = SeedItem("Theirs", userId: OtherUserId);

        var ok = await _client.DeleteAsync($"/api/grocery-items/{mine}");
        var notFound = await _client.DeleteAsync($"/api/grocery-items/{theirs}");

        ok.StatusCode.Should().Be(HttpStatusCode.NoContent);
        notFound.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<GroceryItem>().Single().UserId.Should().Be(OtherUserId);
    }

    // ── PATCH toggle-list ───────────────────────────────────────────────────

    [Fact]
    public async Task ToggleList_FlipsIsOnList_EachCall()
    {
        var id = SeedItem(isOnList: false);

        var first = await _client.PatchAsync($"/api/grocery-items/{id}/toggle-list", null);
        var afterFirst = _factory.GetAll<GroceryItem>().Single().IsOnList;
        await _client.PatchAsync($"/api/grocery-items/{id}/toggle-list", null);
        var afterSecond = _factory.GetAll<GroceryItem>().Single().IsOnList;

        first.StatusCode.Should().Be(HttpStatusCode.OK);
        afterFirst.Should().BeTrue();
        afterSecond.Should().BeFalse();
    }

    [Fact]
    public async Task ToggleList_ReturnsNotFound_AndKeepsFlag_WhenOwnedByAnotherUser()
    {
        var id = SeedItem(isOnList: false, userId: OtherUserId);

        var response = await _client.PatchAsync($"/api/grocery-items/{id}/toggle-list", null);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.GetAll<GroceryItem>().Single().IsOnList.Should().BeFalse();
    }

    // ── POST purchase ───────────────────────────────────────────────────────

    [Fact]
    public async Task Purchase_RecordsPurchase_UpdatesItemSnapshot_AndRemovesItFromList()
    {
        var costco = SeedSupermarket();
        var id = SeedItem("Milk", isOnList: true);
        var before = DateTime.UtcNow;

        var response = await _client.PostAsJsonAsync($"/api/grocery-items/{id}/purchase",
            new PurchaseRequest(costco, 4.5m, 2m));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var purchase = _factory.GetAll<GroceryPurchase>().Single();
        purchase.GroceryItemId.Should().Be(id);
        purchase.SupermarketId.Should().Be(costco);
        purchase.Price.Should().Be(4.5m);
        purchase.Quantity.Should().Be(2m);
        purchase.UserId.Should().Be(TestAuthHandler.UserId);
        purchase.PurchasedAt.Should().BeCloseTo(before, TimeSpan.FromMinutes(1));
        var item = _factory.GetAll<GroceryItem>().Single();
        item.LastPrice.Should().Be(4.5m);
        item.LastQuantity.Should().Be(2m);
        item.LastSupermarketId.Should().Be(costco);
        item.IsOnList.Should().BeFalse();
    }

    [Fact]
    public async Task Purchase_ReturnsBadRequest_AndChangesNothing_WhenSupermarketIsInvalidOrOwnedByAnotherUser()
    {
        var theirs = SeedSupermarket("Theirs", OtherUserId);
        var id = SeedItem("Milk", isOnList: true);

        var other = await _client.PostAsJsonAsync($"/api/grocery-items/{id}/purchase", new PurchaseRequest(theirs, 1m, 1m));
        var missing = await _client.PostAsJsonAsync($"/api/grocery-items/{id}/purchase", new PurchaseRequest(9999, 1m, 1m));

        other.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        missing.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        _factory.CountAll<GroceryPurchase>().Should().Be(0);
        var item = _factory.GetAll<GroceryItem>().Single();
        item.IsOnList.Should().BeTrue();
        item.LastPrice.Should().BeNull();
    }

    [Fact]
    public async Task Purchase_ReturnsNotFound_WhenItemOwnedByAnotherUser()
    {
        var costco = SeedSupermarket();
        var id = SeedItem("Theirs", userId: OtherUserId);

        var response = await _client.PostAsJsonAsync($"/api/grocery-items/{id}/purchase", new PurchaseRequest(costco, 1m, 1m));

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        _factory.CountAll<GroceryPurchase>().Should().Be(0);
    }

    // ── GET purchases ───────────────────────────────────────────────────────

    [Fact]
    public async Task ItemPurchases_OrdersByDateDescending_ForThatItemOnly_AndNotFoundForOthers()
    {
        var costco = SeedSupermarket();
        var milk = SeedItem("Milk");
        var eggs = SeedItem("Eggs");
        var theirs = SeedItem("Theirs", userId: OtherUserId);
        _factory.SeedMany([
            new GroceryPurchase { GroceryItemId = milk, SupermarketId = costco, PurchasedAt = new DateTime(2026, 1, 1), Price = 1m, UserId = TestAuthHandler.UserId },
            new GroceryPurchase { GroceryItemId = milk, SupermarketId = costco, PurchasedAt = new DateTime(2026, 3, 1), Price = 3m, UserId = TestAuthHandler.UserId },
            new GroceryPurchase { GroceryItemId = eggs, SupermarketId = costco, PurchasedAt = new DateTime(2026, 2, 1), Price = 2m, UserId = TestAuthHandler.UserId },
        ]);

        var rows = await _client.GetFromJsonAsync<GroceryPurchase[]>($"/api/grocery-items/{milk}/purchases");
        var response = await _client.GetAsync($"/api/grocery-items/{theirs}/purchases");

        rows!.Select(p => p.Price).Should().Equal(3m, 1m);
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task AllPurchases_ReturnsOwnPurchasesNewestFirst_ExcludingOtherUsers()
    {
        var costco = SeedSupermarket();
        var milk = SeedItem("Milk");
        _factory.SeedMany([
            new GroceryPurchase { GroceryItemId = milk, SupermarketId = costco, PurchasedAt = new DateTime(2026, 1, 1), Price = 1m, UserId = TestAuthHandler.UserId },
            new GroceryPurchase { GroceryItemId = milk, SupermarketId = costco, PurchasedAt = new DateTime(2026, 3, 1), Price = 3m, UserId = TestAuthHandler.UserId },
            new GroceryPurchase { GroceryItemId = milk, SupermarketId = costco, PurchasedAt = new DateTime(2026, 2, 1), Price = 999m, UserId = OtherUserId },
        ]);

        var rows = await _client.GetFromJsonAsync<GroceryPurchase[]>("/api/grocery-items/purchases");

        rows!.Select(p => p.Price).Should().Equal(3m, 1m);
    }
}
