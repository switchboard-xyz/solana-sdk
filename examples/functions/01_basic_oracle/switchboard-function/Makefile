.PHONY: build clean publish

# Variables
DOCKER_IMAGE_NAME ?= gallynaut/basic-oracle-function-v1

DOCKER_BUILD_COMMAND=docker buildx build --platform linux/amd64

# Default make task
all: build

docker_build:
	${DOCKER_BUILD_COMMAND} --pull -f Dockerfile -t ${DOCKER_IMAGE_NAME}:latest ../

docker_publish:
	${DOCKER_BUILD_COMMAND} --pull -f Dockerfile -t ${DOCKER_IMAGE_NAME}:latest --push ../

dev_docker_build:
	${DOCKER_BUILD_COMMAND} --pull -f Dockerfile.dev -t ${DOCKER_IMAGE_NAME}:latest ../../../../../../

dev_docker_publish:
	${DOCKER_BUILD_COMMAND} --pull -f Dockerfile.dev -t ${DOCKER_IMAGE_NAME}:latest --push ../../../../../../

build: docker_build measurement

dev: dev_docker_build measurement

publish: docker_publish measurement

dev_publish: dev_docker_publish measurement

measurement:
	@docker run -d --platform=linux/amd64 -q --name=my-switchboard-function ${DOCKER_IMAGE_NAME}:latest > /dev/null
	@docker cp my-switchboard-function:/measurement.txt measurement.txt
	@echo -n 'MrEnclve: '
	@cat measurement.txt
	@docker stop my-switchboard-function > /dev/null
	@docker rm my-switchboard-function > /dev/null

simulate: docker_build
	docker run -it --platform=linux/amd64 --entrypoint=/bin/bash ${DOCKER_IMAGE_NAME}:latest /boot.sh --test

# Task to clean up the compiled rust application
clean:
	cargo clean

# latest_mr_enclave:
# 	@docker run -d --pull=always --platform=linux/amd64 --name=latest-my-switchboard-function ${DOCKER_IMAGE_NAME}:latest > /dev/null
# 	@docker cp latest-my-switchboard-function:/measurement.txt latest-measurement.txt
# 	@docker stop latest-my-switchboard-function > /dev/null
# 	@docker rm latest-my-switchboard-function > /dev/null
#     @echo latest MrEnclave: $(shell rm ./latest-measurement.txt)
