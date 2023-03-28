[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/programs/anchor-vrf-parser/src/actions)

The `sbv2-solana` project contains code for managing the state and results of a Verifiable Random Function (VRF) client on the Solana blockchain. The code is organized into several modules, each responsible for a specific aspect of the VRF client's lifecycle.

1. `init_state`: This module initializes the state of a `VrfClient` account, which interacts with the Switchboard V2 protocol to request and receive verifiable random numbers. The `InitState` struct and its associated methods set up the initial state with the correct data and settings.

   Example usage:
   ```rust
   let params = InitStateParams {
       max_result: 100,
       permission_bump: 1,
       switchboard_state_bump: 2,
   };

   let ctx = Context::new(...);
   let init_state = InitState::new(...);

   init_state.validate(&ctx, &params)?;
   init_state.actuate(&ctx, &params)?;
   ```

2. `request_result`: This module handles requests for random numbers from the Switchboard V2 oracle network. The `RequestResult` struct and its associated methods interact with the oracle network to request randomness securely and efficiently.

   Example usage:
   ```rust
   let request_result = RequestResult::new(...);
   request_result.validate(&ctx)?;
   request_result.actuate(&ctx)?;
   ```

3. `update_result`: This module updates the VRF client's state with the latest VRF result. The `UpdateResult` struct and its associated methods calculate the new result value based on the VRF result buffer and update the client state accordingly.

   Example usage:
   ```rust
   let update_result = UpdateResult::new(...);
   update_result.validate(&ctx)?;
   update_result.actuate(&ctx)?;
   ```

4. `close_state`: This module closes a VRF account securely and correctly. The `CloseState` struct and its associated methods ensure proper validation and actuation steps are taken when closing the VRF account.

   Example usage:
   ```rust
   let close_state_params = CloseStateParams {};
   let close_state_context = Context::new(close_state_accounts, close_state_params);
   close_state.validate(&close_state_context, &close_state_params)?;
   close_state.actuate(&close_state_context, &close_state_params)?;
   ```

These modules work together to manage the lifecycle of a VRF client on the Solana blockchain. They provide a way to initialize the client's state, request random numbers from the Switchboard V2 oracle network, update the client's state with the latest results, and close the VRF account when necessary. This code is essential for any application that requires random numbers from the Switchboard V2 oracle network.
