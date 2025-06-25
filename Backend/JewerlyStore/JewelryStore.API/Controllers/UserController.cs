using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using JewelryStore.Application.Interfaces;
using JewelryStore.Dtos.Request;
using JewelryStore.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JewelryStore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;
    private readonly IUserRepository _repository;

    public UserController(IUserService service, IUserRepository repository)
    {
        _service = service;
        _repository = repository;
    }

    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllUsers(int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
    {
        var users = await _repository.GetPaginatedListAsync(pageNumber: page, pageSize: pageSize, cancellationToken);
        
        if(users is null) return NotFound();
        
        return Ok(users);
    }
    
    [Authorize]
    [HttpGet("[action]")]
    public async Task<IActionResult> MeInfo(CancellationToken cancellationToken)
    {
        var token = Request.Cookies["tasty"];
       
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenRead = tokenHandler.ReadJwtToken(token);
        
        var email = tokenRead.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var role = tokenRead.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        
        if(email is null) return BadRequest();
        
        var user = await _repository.GetByEmailAsync(email, cancellationToken);

        return Ok(new
        {
            user.Email,
            user.FirstName,
            user.LastName,
            Role = role
        });
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register(
        [FromForm] UserRegisterRequest request, 
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            throw new Exception();
        try
        {
            await _service.Register(request.FirstName, request.LastName, request.Email, request.Password, cancellationToken);
            return Ok("Success");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
        
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login(
        UserLoginRequest request, 
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            throw new Exception();
        
        try
        {
            var token = await _service.Login(request.Email, request.Password, cancellationToken);
            Response.Cookies.Append("tasty", token, new CookieOptions()
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                Path = "/"
            });
            
            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("Logout")]
    public Task<IActionResult> Logout()
    {
        try
        {
            Response.Cookies.Delete("tasty");
            return Task.FromResult<IActionResult>(Ok("Success"));
        }
        catch (Exception ex)
        {
            return Task.FromResult<IActionResult>(BadRequest(ex.Message));
        }
    }
}