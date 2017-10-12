package router

import (
	"flag"
	gql "github.com/chanceeakin/magic-mirror/web/server/graphql"
	"github.com/gorilla/mux"
	"github.com/neelance/graphql-go"
	"github.com/neelance/graphql-go/relay"
	"net/http"
	"time"
)

var schema *graphql.Schema

func init() {
	schema = graphql.MustParseSchema(gql.Schema, &gql.Resolver{})
}

// NewRouter creates the mux router!
func NewRouter() *http.Server {
	var entry, static, favicon, assetManifest, manifest, serviceWorker string

	flag.StringVar(&entry, "entry", "./../client/build/index.html", "the entrypoint to serve.")
	flag.StringVar(&static, "static", "./../client/build/", "static assets")
	flag.StringVar(&favicon, "favicon", "./../client/build/favicon.ico", "favicon")
	flag.StringVar(&assetManifest, "asset-manifest", "./../client/build/asset-manifest.json", "asset-manifest")
	flag.StringVar(&manifest, "manifest", "./../client/build/manifest.json", "manifest")
	flag.StringVar(&serviceWorker, "service-worker", "./../client/build/service-worker.js", "service worker")
	flag.Parse()

	router := mux.NewRouter()
	router.HandleFunc("/graphiql", graphIQL)
	router.HandleFunc("/api/signup", SignupHandler)
	router.HandleFunc("/api/login", LoginHandler)
	router.HandleFunc("/api/logout", LogoutHandler)
	router.Handle("/graphql", &relay.Handler{Schema: schema})
	// this is how create react app works and does client side rendering in GoLang. WTF.
	router.PathPrefix("/static").Handler(http.FileServer(http.Dir(static)))
	router.PathPrefix("/favicon.ico").HandlerFunc(IndexHandler(favicon))
	router.PathPrefix("/service-worker.js").HandlerFunc(IndexHandler(serviceWorker))
	router.PathPrefix("/asset-manifest.json").HandlerFunc(IndexHandler(assetManifest))
	router.PathPrefix("/manifest.json").HandlerFunc(IndexHandler(manifest))
	router.PathPrefix("/").HandlerFunc(IndexHandler(entry))

	srv := &http.Server{
		Handler: router,
		Addr:    "127.0.0.1:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	return srv
}
