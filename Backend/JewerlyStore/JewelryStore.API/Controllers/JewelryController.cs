using System.ComponentModel.DataAnnotations;
using AutoMapper;
using JewelryStore.Application.Interfaces;
using JewelryStore.Domain.Models;
using JewelryStore.Dtos.Request;
using JewelryStore.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JewelryStore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JewelryController : ControllerBase
{
    private readonly IJewelryRepository _repository;
    private readonly IMapper _mapper;
    private readonly IJewelryService _service;

    public JewelryController(IJewelryRepository repository, IMapper mapper, IJewelryService service)
    {
        _repository = repository;
        _mapper = mapper;
        _service = service;
    }

    [HttpGet("[action]")]
    public async Task<IActionResult> GetJewelries(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10, 
        CancellationToken cancellationToken = default)
    {
        var jewelries = await _repository.GetPaginatedListAsync(pageNumber, pageSize, cancellationToken);
        
        if(jewelries == null) 
            return Ok("No Jewelries");
        
        return Ok(jewelries);
    }

    [HttpGet("[action]")]
    public async Task<IActionResult> GetJewelry([FromQuery] Guid jewelryId, CancellationToken cancellationToken)
    {
        var jewelry = await _repository.GetByIdAsync(jewelryId, cancellationToken);
        
        if(jewelry == null) 
            return Ok("No Jewelry");
        
        return Ok(jewelry);
    }

    [Authorize(Roles = "admin")]
    [HttpPost("[action]")]
    public async Task<IActionResult> AddJewelry(
        [FromForm] JewelryAddRequest request, 
        [DataType(DataType.Upload)] IFormFile mainImageUrl, 
        CancellationToken cancellationToken)
    {
        var jewelry = await _service.AddJewelryAsync(_mapper.Map<Jewelry>(request), mainImageUrl, cancellationToken);
        
        return Ok(jewelry);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("[action]")]
    public async Task<IActionResult> DeleteJewelry([FromForm] Guid jewelryId, CancellationToken cancellationToken)
    {
        await _repository.DeleteAsync(jewelryId, cancellationToken);
        
        return Ok("Jewelry has been deleted");
    }
}