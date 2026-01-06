package middleware

import (
  "strings"

  "github.com/gofiber/fiber/v2"
  "github.com/golang-jwt/jwt/v5"
)

var JWTSecret = []byte("fallback-secret")

func JWTAuth() fiber.Handler {
  return func(c *fiber.Ctx) error {
    auth := c.Get("Authorization")
    if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
      return c.Status(401).JSON(fiber.Map{"error": "Missing token"})
    }

    tokenStr := strings.TrimPrefix(auth, "Bearer ")
    token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
      return JWTSecret, nil
    })

    if err != nil || !token.Valid {
      return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
    }

    claims := token.Claims.(jwt.MapClaims)
    c.Locals("operatorID", claims["sub"])
    c.Locals("role", claims["role"])

    return c.Next()
  }
}
