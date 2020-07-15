APP_PKG := $(shell echo ${PWD} | sed -e "s\#${GOPATH}/src/\#\#g")
APP_VERSION := $(shell git describe --tags)
COMMIT_ID = $(shell git rev-parse --short HEAD)
BUILD_TIME := $(shell date -u +"%FT%TZ")
DOCKER_PREFIX := affinity
IMAGE_NAME := ${DOCKER_PREFIX}:latest
DOCKER_REG := xjtroddy

test_docker_compose:
	@npm run build
	@rm -rf ./tmp
	@trap "docker-compose down ; rm -rf ./tmp" SIGINT SIGTERM \
	&& docker-compose up -d \
	&& NODE_ENV=tman ./node_modules/.bin/tman 'server/test/**/*.js' \
	; docker-compose down
	@rm -rf ./tmp

test_ci:
	@docker-compose up -d \
	&& NODE_ENV=tman istanbul cover _tman 'server/test/**/*.js'

.PHONY: build
build:
	npm install
	npm run build
	sed 's/"version".*/"version": "1.0.0",/g' ./package.json > ./package.json.swp
	docker build \
  --build-arg BUILD_TIME=${BUILD_TIME} \
  --build-arg BUILD_COMMIT=${BUILD_COMMIT} \
	--build-arg BUILD_AUTHOR=${GITLAB_USER_NAME} \
	--build-arg BUILD_ID=${CI_COMMIT_SHA} \
  -t ${IMAGE_NAME} .

.PHONY: push-image
push-image:
	docker tag ${IMAGE_NAME} ${DOCKER_REG}/${IMAGE_NAME}
	docker push ${DOCKER_REG}/${IMAGE_NAME}
