#!/usr/bin/env sh

bun run build
rm -rf docker/dist/*
cp -r dist/* docker/dist/
