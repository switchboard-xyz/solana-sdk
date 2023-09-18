# syntax=docker/dockerfile:1.4
FROM switchboardlabs/sgx-function AS builder

ARG CARGO_NAME=switchboard-function
ENV CARGO_NAME=$CARGO_NAME

WORKDIR /home/root/switchboard-function/switchboard-function
COPY ./Cargo.lock ./Cargo.toml  ./
COPY ./src ./src

RUN --mount=type=cache,target=/usr/local/cargo/registry,id=${TARGETPLATFORM} --mount=type=cache,target=target,id=${TARGETPLATFORM} \
    cargo build --release && \
    cargo strip && \
    mv target/release/${CARGO_NAME} /sgx/app

FROM switchboardlabs/sgx-function

# Copy the binary
WORKDIR /sgx
COPY --from=builder /sgx/app /sgx

# Get the measurement from the enclave
RUN /get_measurement.sh

ENTRYPOINT ["bash", "/boot.sh"]
