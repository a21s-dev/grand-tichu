
build:
	@sh ./scripts/internal/build-app.sh


build-docker-image:
	@cd docker && docker build --no-cache --file Dockerfile --tag registry.a21.dev/grand-tichu .
