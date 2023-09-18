# syntax=docker/dockerfile:1.4
FROM switchboardlabs/sgx-function:main AS builder

ARG CARGO_NAME=switchboard-function
ENV CARGO_NAME=$CARGO_NAME

WORKDIR /home/root/switchboard-function
COPY ./Anchor.toml ./Cargo.lock ./Cargo.toml ./
COPY ./src ./src

WORKDIR /home/root/switchboard-function/switchboard-function
COPY ./switchboard-function/Cargo.lock ./switchboard-function/Cargo.toml  ./
COPY ./switchboard-function/src ./src

RUN --mount=target=/home/root/.cargo/git,type=cache \
    --mount=target=/home/root/.cargo/registry,type=cache \
    --mount=type=cache,target=/home/root/switchboard-function/switchboard-function/target \
    cargo build --release && \
    cargo strip && \
    mv target/release/basic-oracle-function /sgx/app

FROM switchboardlabs/sgx-function:main

# Copy the binary
WORKDIR /sgx
COPY --from=builder /sgx/app /sgx

# Get the measurement from the enclave
RUN /get_measurement.sh

ENTRYPOINT ["bash", "/boot.sh"]
