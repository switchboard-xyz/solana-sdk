.PHONY: build clean publish

# Variables
CARGO_NAME=basic-oracle-function
DOCKER_IMAGE_NAME=${CONTAINER_NAME}

DOCKER_BUILD_COMMAND=DOCKER_BUILDKIT=1 docker buildx build --platform linux/amd64 --build-arg CARGO_NAME=${CARGO_NAME}

# Default make task
all: build

docker_build: 
	${DOCKER_BUILD_COMMAND} --pull -f Dockerfile -t ${DOCKER_IMAGE_NAME}:latest --load ../

docker_publish: 
	${DOCKER_BUILD_COMMAND} --pull -f Dockerfile -t ${DOCKER_IMAGE_NAME}:latest --push ../

dev_docker_build: 
	${DOCKER_BUILD_COMMAND} --pull -f Dockerfile.dev -t ${DOCKER_IMAGE_NAME}:latest --load ../../../../../../

dev_docker_publish: 
	${DOCKER_BUILD_COMMAND} --pull -f Dockerfile.dev -t ${DOCKER_IMAGE_NAME}:latest --push ../../../../../../

build: docker_build measurement

dev: dev_docker_build measurement

publish: docker_publish measurement

dev_publish: dev_docker_publish measurement

measurement:
	@docker run -d --platform=linux/amd64 --pull always -q --name=my-switchboard-function ${DOCKER_IMAGE_NAME}:latest > /dev/null
	@docker cp my-switchboard-function:/measurement.txt measurement.txt
	@docker stop my-switchboard-function > /dev/null
	@docker rm my-switchboard-function > /dev/null
	@echo MrEnclave: $(shell cat ./measurement.txt)

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