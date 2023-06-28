# syntax=docker/dockerfile:1.4
FROM switchboardlabs/sgx-function AS builder

ARG CARGO_NAME=switchboard-function

WORKDIR /home/root/switchboard-function
COPY . .

WORKDIR /home/root/switchboard-function/sgx-function

# RUN --mount=type=cache,target=/usr/local/cargo/registry,id=${TARGETPLATFORM} --mount=type=cache,target=./sgx-function/target,id=${TARGETPLATFORM} \
#     cargo build --release && \
#     cargo strip && \
#     mv /home/root/switchboard-function/sgx-function/target/release/${CARGO_NAME} /sgx

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

# COPY configs/app.manifest.template .
# COPY configs/boot.sh /boot.sh
RUN gramine-manifest /app.manifest.template > app.manifest
# RUN gramine-sgx-gen-private-key
RUN gramine-sgx-sign --manifest app.manifest --output app.manifest.sgx | tail -2 | tee /measurement.txt

ENTRYPOINT ["bash", "/boot.sh"]
