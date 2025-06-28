using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using JewelryStore.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JewelryStore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartRepository _cartRepository;
    private readonly IUserRepository _userRepository;

    public CartController(ICartRepository cartRepository, IUserRepository userRepository)
    {
        _cartRepository = cartRepository;
        _userRepository = userRepository;
    }

    [Authorize]
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var token = Request.Cookies["tasty"];
       
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenRead = tokenHandler.ReadJwtToken(token);
        
        var email = tokenRead.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        
        if(email is null) return BadRequest();
        
        var user = await _userRepository.GetByEmailAsync(email, cancellationToken);
        
        var cart = await _cartRepository.GetAllByUserIdAsync(user.UserId, cancellationToken);
        
        return Ok(cart);
    }

    [Authorize]
    [HttpPost("AddJewelryInCart/{jewelryId:guid}")]
    public async Task<IActionResult> AddJewelryInCart(Guid jewelryId, CancellationToken cancellationToken)
    {
        var token = Request.Cookies["tasty"];
       
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenRead = tokenHandler.ReadJwtToken(token);
        
        var email = tokenRead.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        
        if(email is null) return BadRequest();
        
        var user = await _userRepository.GetByEmailAsync(email, cancellationToken);
        
        var jewelry = await _cartRepository.AddAsync(jewelryId, user.UserId, cancellationToken);
        
        return Ok(jewelry);
    }

    [Authorize]
    [HttpDelete("RemoveJewelryInCart/{jewelryId:guid}")]
    public async Task<IActionResult> RemoveJewelryInCart(Guid jewelryId, CancellationToken cancellationToken)
    {
        var token = Request.Cookies["tasty"];
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenRead = tokenHandler.ReadJwtToken(token);
        var email = tokenRead.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        if(email is null) return BadRequest();
        var user = await _userRepository.GetByEmailAsync(email, cancellationToken);
        
        var jewelry = await _cartRepository.DeleteAsync(jewelryId, user.UserId, cancellationToken);
        
        return Ok(jewelry);
    }
}