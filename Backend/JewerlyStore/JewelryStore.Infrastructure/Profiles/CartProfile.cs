using AutoMapper;
using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Entities;

namespace JewelryStore.Infrastructure.Profiles;

public class CartProfile : Profile
{
    public CartProfile()
    {
        CreateMap<Cart, CartEntity>();
        CreateMap<CartEntity, Cart>();
    }
}