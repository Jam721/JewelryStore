using AutoMapper;
using JewelryStore.Domain.Models;
using JewelryStore.Dtos.Request;

namespace JewelryStore.Dtos.Profiles;

public class JewelryDtoProfiles : Profile
{
    public JewelryDtoProfiles()
    {
        CreateMap<Jewelry, JewelryAddRequest>();
        CreateMap<JewelryAddRequest, Jewelry>();
    }
}