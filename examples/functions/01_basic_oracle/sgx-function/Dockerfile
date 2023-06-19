# syntax=docker/dockerfile:1.4
FROM switchboardlabs/sgx-function AS builder

ARG CARGO_NAME=switchboard-function

WORKDIR /home/root/switchboard-function
COPY . .

WORKDIR /home/root/switchboard-function/sgx-function

RUN --mount=type=cache,target=/usr/local/cargo/registry,id=${TARGETPLATFORM} --mount=type=cache,target=target,id=${TARGETPLATFORM} \
    cargo build --release && \
    cargo strip && \
    mv /home/root/switchboard-function/sgx-function/target/release/${CARGO_NAME} /sgx

FROM switchboardlabs/sgx-function

# Copy the binary
WORKDIR /sgx
COPY --from=builder /sgx/${CARGO_NAME} /sgx/app

# Get the measurement from the enclave
RUN /get_measurement.sh