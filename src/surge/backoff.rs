use std::time::Duration;

#[derive(Debug, Clone)]
pub struct ExponentialBackoff {
    initial: Duration,
    max: Duration,
    multiplier: f64,
    current: Duration,
}

impl ExponentialBackoff {
    /// Create a new exponential backoff
    ///
    /// # Arguments
    /// * `initial` - Starting delay
    /// * `max` - Maximum delay (cap)
    /// * `multiplier` - Growth factor (e.g., 2.0 for doubling)
    ///
    /// # Example
    /// ```
    /// use surge_client::backoff::ExponentialBackoff;
    /// use std::time::Duration;
    ///
    /// let backoff = ExponentialBackoff::new(
    ///     Duration::from_millis(100),
    ///     Duration::from_secs(30),
    ///     2.0,
    /// );
    /// ```
    pub fn new(initial: Duration, max: Duration, multiplier: f64) -> Self {
        Self {
            initial,
            max,
            multiplier,
            current: initial,
        }
    }

    /// Get the next delay duration and advance the backoff
    ///
    /// # Example
    /// ```
    /// use surge_client::backoff::ExponentialBackoff;
    /// use std::time::Duration;
    ///
    /// let mut backoff = ExponentialBackoff::new(
    ///     Duration::from_millis(100),
    ///     Duration::from_secs(5),
    ///     2.0,
    /// );
    ///
    /// let delay1 = backoff.next_delay(); // 100ms
    /// let delay2 = backoff.next_delay(); // 200ms
    /// let delay3 = backoff.next_delay(); // 400ms
    /// ```
    pub fn next_delay(&mut self) -> Duration {
        let delay = self.current;

        // Calculate next delay with exponential growth
        let next_ms = (self.current.as_millis() as f64 * self.multiplier) as u64;
        let next = Duration::from_millis(next_ms);

        // Cap at maximum delay
        self.current = std::cmp::min(next, self.max);

        delay
    }

    /// Reset backoff to initial delay
    ///
    /// Called after a successful stable connection to reset the backoff state.
    ///
    /// # Example
    /// ```
    /// use surge_client::backoff::ExponentialBackoff;
    /// use std::time::Duration;
    ///
    /// let mut backoff = ExponentialBackoff::new(
    ///     Duration::from_millis(100),
    ///     Duration::from_secs(5),
    ///     2.0,
    /// );
    ///
    /// backoff.next_delay();
    /// backoff.next_delay();
    /// backoff.reset(); // Back to 100ms
    /// ```
    pub fn reset(&mut self) {
        self.current = self.initial;
    }

    /// Get the current delay without advancing
    pub fn current_delay(&self) -> Duration {
        self.current
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_exponential_growth() {
        let mut backoff =
            ExponentialBackoff::new(Duration::from_millis(100), Duration::from_secs(10), 2.0);

        assert_eq!(backoff.next_delay(), Duration::from_millis(100));
        assert_eq!(backoff.next_delay(), Duration::from_millis(200));
        assert_eq!(backoff.next_delay(), Duration::from_millis(400));
        assert_eq!(backoff.next_delay(), Duration::from_millis(800));
        assert_eq!(backoff.next_delay(), Duration::from_millis(1600));
    }

    #[test]
    fn test_max_cap() {
        let mut backoff =
            ExponentialBackoff::new(Duration::from_secs(1), Duration::from_secs(5), 2.0);

        assert_eq!(backoff.next_delay(), Duration::from_secs(1));
        assert_eq!(backoff.next_delay(), Duration::from_secs(2));
        assert_eq!(backoff.next_delay(), Duration::from_secs(4));
        // Should cap at 5 seconds
        assert_eq!(backoff.next_delay(), Duration::from_secs(5));
        assert_eq!(backoff.next_delay(), Duration::from_secs(5));
        assert_eq!(backoff.next_delay(), Duration::from_secs(5));
    }

    #[test]
    fn test_reset() {
        let mut backoff =
            ExponentialBackoff::new(Duration::from_millis(100), Duration::from_secs(10), 2.0);

        backoff.next_delay(); // 100ms
        backoff.next_delay(); // 200ms
        backoff.next_delay(); // 400ms

        backoff.reset();

        assert_eq!(backoff.next_delay(), Duration::from_millis(100));
        assert_eq!(backoff.next_delay(), Duration::from_millis(200));
    }

    #[test]
    fn test_current_delay_no_advance() {
        let mut backoff =
            ExponentialBackoff::new(Duration::from_millis(100), Duration::from_secs(10), 2.0);

        assert_eq!(backoff.current_delay(), Duration::from_millis(100));
        assert_eq!(backoff.current_delay(), Duration::from_millis(100));

        backoff.next_delay();

        assert_eq!(backoff.current_delay(), Duration::from_millis(200));
        assert_eq!(backoff.current_delay(), Duration::from_millis(200));
    }

    #[test]
    fn test_different_multiplier() {
        let mut backoff =
            ExponentialBackoff::new(Duration::from_millis(100), Duration::from_secs(10), 1.5);

        assert_eq!(backoff.next_delay(), Duration::from_millis(100));
        assert_eq!(backoff.next_delay(), Duration::from_millis(150));
        assert_eq!(backoff.next_delay(), Duration::from_millis(225));
    }
}
