using AutoMapper;
using JewelryStore.Domain.Models;
using JewelryStore.Infrastructure.Entities;

namespace JewelryStore.Infrastructure.Profiles;

public class JewelryProfile : Profile
{
    public JewelryProfile()
    {
        CreateMap<Jewelry, JewelryEntity>();
        CreateMap<JewelryEntity, Jewelry>();
    }
}