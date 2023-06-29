# syntax=docker/dockerfile:1.4
FROM switchboardlabs/sgx-function AS builder

ARG CARGO_NAME=switchboard-function

WORKDIR /home/root/switchboard-function
COPY . .

WORKDIR /home/root/switchboard-function/sgx-function

RUN  --mount=type=cache,target=/usr/local/cargo/registry --mount=type=cache,target=/home/root/switchboard-function/sgx-function/target \
    cargo build --release && \
    cargo strip && \
    mv target/release/basic-oracle-function /sgx/app

FROM switchboardlabs/sgx-function

# Copy the binary
WORKDIR /sgx
COPY --from=builder /sgx/app /sgx

# Get the measurement from the enclave
RUN /get_measurement.sh

ENTRYPOINT ["bash", "/boot.sh"]
