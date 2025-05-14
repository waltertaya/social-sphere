package main

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/waltertaya/social-sphere/api-gateway/initializers"
	"github.com/waltertaya/social-sphere/api-gateway/middlewares"
)

func reverseProxy(target string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		remote, err := url.Parse(target)

		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadGateway, gin.H{
				"error": "Bad Upstream",
			})
		}

		proxy := httputil.NewSingleHostReverseProxy(remote)

		proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
			w.WriteHeader(http.StatusBadGateway)
			w.Write([]byte("Upstream service error"))
		}

		ctx.Request.URL.Path = ctx.Param("proxypath")
		proxy.ServeHTTP(ctx.Writer, ctx.Request)
	}
}

func main() {
	initializers.InitConfig()

	r := gin.Default()

	r.Use(gin.Recovery())

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:5173"
		},
		MaxAge: 12 * time.Hour,
	}))

	r.Any("/api/v2/auth/*proxyPath", reverseProxy("http://localhost:8000"))

	protectedGroup := r.Group("/api/v2/bd")
	protectedGroup.Use(middlewares.JWTMiddleware())

	protectedGroup.Any("/*proxyPath", reverseProxy("http://localhost:5000"))

	r.Run(":8080")
}
