.PHONY: build clean publish

# Variables
CARGO_NAME=basic-oracle-function
DOCKER_IMAGE_NAME=switchboardlabs/basic-oracle-function

DOCKER_BUILD_COMMAND=DOCKER_BUILDKIT=1 docker buildx build --platform linux/amd64 --build-arg CARGO_NAME=${CARGO_NAME}

# Default make task
all: build

docker_build: 
	${DOCKER_BUILD_COMMAND} -f Dockerfile -t ${DOCKER_IMAGE_NAME} --load ../
docker_publish: 
	${DOCKER_BUILD_COMMAND} -f Dockerfile -t ${DOCKER_IMAGE_NAME} --push ../

dev_docker_build: 
	${DOCKER_BUILD_COMMAND} -f Dockerfile.dev -t ${DOCKER_IMAGE_NAME} --load ../../../../
dev_docker_publish: 
	${DOCKER_BUILD_COMMAND} -f Dockerfile.dev -t ${DOCKER_IMAGE_NAME} --push ../../../../

build: docker_build measurement

dev: dev_docker_build measurement

publish: docker_publish measurement

measurement:
	@docker run -d --name my-switchboard-function $(DOCKER_IMAGE_NAME) > /dev/null
	@docker cp my-switchboard-function:/measurement.txt measurement.txt
	@docker stop my-switchboard-function > /dev/null
	@docker rm my-switchboard-function > /dev/null

# Task to clean up the compiled rust application
clean:
	cargo clean
