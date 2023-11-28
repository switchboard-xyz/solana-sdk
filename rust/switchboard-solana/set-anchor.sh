#!/bin/bash

# exit when any command fails
set -e

function set_anchor_27 {
  was_changed="false"

  if [[ -f "Cargo.anchor27.lock" ]]; then
    if [[ -f "Cargo.anchor28.lock" ]]; then
      mv Cargo.lock Cargo.anchor29.lock
      mv Cargo.anchor27.lock Cargo.lock
      was_changed="true"
    elif [[ -f "Cargo.anchor29.lock" ]]; then
      mv Cargo.lock Cargo.anchor28.lock
      mv Cargo.anchor27.lock Cargo.lock
      was_changed="true"
    fi
  fi

  if [[ -f "Cargo.anchor27.toml" ]]; then
    if [[ -f "Cargo.anchor28.toml" ]]; then
      mv Cargo.toml Cargo.anchor29.toml
      mv Cargo.anchor27.toml Cargo.toml
      was_changed="true"
    elif [[ -f "Cargo.anchor29.toml" ]]; then
      mv Cargo.toml Cargo.anchor28.toml
      mv Cargo.anchor27.toml Cargo.toml
      was_changed="true"
    fi
  fi

  if [[ -f "src/attestation_program/accounts/request.anchor27.rs" ]]; then
    if [[ -f "src/attestation_program/accounts/request.anchor28.rs" ]]; then
      mv src/attestation_program/accounts/request.rs src/attestation_program/accounts/request.anchor29.rs
    elif [[ -f "src/attestation_program/accounts/request.anchor29.rs" ]]; then
      mv src/attestation_program/accounts/request.rs src/attestation_program/accounts/request.anchor28.rs
    fi
    mv src/attestation_program/accounts/request.anchor27.rs src/attestation_program/accounts/request.rs
    was_changed="true"
  fi
  if [[ -f "src/attestation_program/accounts/routine.anchor27.rs" ]]; then
    mv src/attestation_program/accounts/routine.rs src/attestation_program/accounts/routine.anchor28.rs
    mv src/attestation_program/accounts/routine.anchor27.rs src/attestation_program/accounts/routine.rs
    was_changed="true"
  fi
  if [[ -f "src/attestation_program/accounts/service.anchor27.rs" ]]; then
    mv src/attestation_program/accounts/service.rs src/attestation_program/accounts/service.anchor28.rs
    mv src/attestation_program/accounts/service.anchor27.rs src/attestation_program/accounts/service.rs
    was_changed="true"
  fi
  if [[ -f "src/client/program.anchor27.rs" ]]; then
    mv src/client/program.rs src/client/program.anchor28.rs
    mv src/client/program.anchor27.rs src/client/program.rs
    was_changed="true"
  fi

  if [[ "${was_changed}" == "true" ]]; then
    cargo clean || true
    cargo build
    cargo update -p solana-zk-token-sdk --precise 1.14.16
  fi
}

function set_anchor_28 {
  was_changed="false"

  if [[ -f "Cargo.anchor28.lock" ]]; then
    if [[ -f "Cargo.anchor27.lock" ]]; then
      mv Cargo.lock Cargo.anchor29.lock
      mv Cargo.anchor28.lock Cargo.lock
      was_changed="true"
    elif [[ -f "Cargo.anchor29.lock" ]]; then
      mv Cargo.lock Cargo.anchor27.lock
      mv Cargo.anchor28.lock Cargo.lock
      was_changed="true"
    fi
  fi

  if [[ -f "Cargo.anchor28.toml" ]]; then
    if [[ -f "Cargo.anchor27.toml" ]]; then
      mv Cargo.toml Cargo.anchor29.toml
      mv Cargo.anchor28.toml Cargo.toml
      was_changed="true"
    elif [[ -f "Cargo.anchor29.toml" ]]; then
      mv Cargo.toml Cargo.anchor27.toml
      mv Cargo.anchor28.toml Cargo.toml
      was_changed="true"
    fi
  fi

  # Handle request.rs file renaming logic
  if [[ -f "src/attestation_program/accounts/request.anchor28.rs" ]]; then
    if [[ -f "src/attestation_program/accounts/request.anchor27.rs" ]]; then
      mv src/attestation_program/accounts/request.rs src/attestation_program/accounts/request.anchor29.rs
    elif [[ -f "src/attestation_program/accounts/request.anchor29.rs" ]]; then
      mv src/attestation_program/accounts/request.rs src/attestation_program/accounts/request.anchor27.rs
    fi
    mv src/attestation_program/accounts/request.anchor28.rs src/attestation_program/accounts/request.rs
    was_changed="true"
  fi
  if [[ -f "src/attestation_program/accounts/routine.anchor28.rs" ]]; then
    mv src/attestation_program/accounts/routine.rs src/attestation_program/accounts/routine.anchor27.rs
    mv src/attestation_program/accounts/routine.anchor28.rs src/attestation_program/accounts/routine.rs
    was_changed="true"
  fi
  if [[ -f "src/attestation_program/accounts/service.anchor28.rs" ]]; then
    mv src/attestation_program/accounts/service.rs src/attestation_program/accounts/service.anchor27.rs
    mv src/attestation_program/accounts/service.anchor28.rs src/attestation_program/accounts/service.rs
    was_changed="true"
  fi
  if [[ -f "src/client/program.anchor28.rs" ]]; then
    mv src/client/program.rs src/client/program.anchor27.rs
    mv src/client/program.anchor28.rs src/client/program.rs
    was_changed="true"
  fi

  if [[ "${was_changed}" == "true" ]]; then
    cargo clean || true
    cargo build
  fi
}

function set_anchor_29 {
  was_changed="false"

  if [[ -f "Cargo.anchor29.lock" ]]; then
    if [[ -f "Cargo.anchor28.lock" ]]; then
      mv Cargo.lock Cargo.anchor27.lock
      mv Cargo.anchor29.lock Cargo.lock
      was_changed="true"
    elif [[ -f "Cargo.anchor27.lock" ]]; then
      mv Cargo.lock Cargo.anchor28.lock
      mv Cargo.anchor29.lock Cargo.lock
      was_changed="true"
    fi
  fi

  if [[ -f "Cargo.anchor29.toml" ]]; then
    if [[ -f "Cargo.anchor27.toml" ]]; then
      mv Cargo.toml Cargo.anchor28.toml
      mv Cargo.anchor29.toml Cargo.toml
      was_changed="true"
    elif [[ -f "Cargo.anchor28.toml" ]]; then
      mv Cargo.toml Cargo.anchor27.toml
      mv Cargo.anchor29.toml Cargo.toml
      was_changed="true"
    fi
  fi

  # Handle request.rs file renaming logic
  if [[ -f "src/attestation_program/accounts/request.anchor29.rs" ]]; then
    if [[ -f "src/attestation_program/accounts/request.anchor27.rs" ]]; then
      mv src/attestation_program/accounts/request.rs src/attestation_program/accounts/request.anchor28.rs
    elif [[ -f "src/attestation_program/accounts/request.anchor28.rs" ]]; then
      mv src/attestation_program/accounts/request.rs src/attestation_program/accounts/request.anchor27.rs
    fi
    mv src/attestation_program/accounts/request.anchor29.rs src/attestation_program/accounts/request.rs
    was_changed="true"
  fi
  if [[ -f "src/attestation_program/accounts/routine.anchor27.rs" ]]; then
    mv src/attestation_program/accounts/routine.rs src/attestation_program/accounts/routine.anchor28.rs
    mv src/attestation_program/accounts/routine.anchor27.rs src/attestation_program/accounts/routine.rs
    was_changed="true"
  fi
  if [[ -f "src/attestation_program/accounts/service.anchor27.rs" ]]; then
    mv src/attestation_program/accounts/service.rs src/attestation_program/accounts/service.anchor28.rs
    mv src/attestation_program/accounts/service.anchor27.rs src/attestation_program/accounts/service.rs
    was_changed="true"
  fi
  if [[ -f "src/client/program.anchor28.rs" ]]; then
    mv src/client/program.rs src/client/program.anchor27.rs
    mv src/client/program.anchor28.rs src/client/program.rs
    was_changed="true"
  fi

  if [[ "${was_changed}" == "true" ]]; then
    cargo clean || true
    cargo build
  fi
}


if [[ "$1" == "27"  ]]; then
  set_anchor_27
elif [[ "$1" == "28"  ]]; then
  set_anchor_28
elif [[ "$1" == "29"  ]]; then
  set_anchor_29
else
  echo ""
fi
