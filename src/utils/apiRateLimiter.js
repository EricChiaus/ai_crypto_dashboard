class APIRateLimiter {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
    this.minInterval = 1200; // 1.2 seconds between requests
    this.maxConcurrent = 1; // Only 1 request at a time
  }

  async addRequest(requestFn, priority = false) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject,
        priority,
        timestamp: Date.now()
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      // Sort by priority (high priority first)
      this.queue.sort((a, b) => b.priority - a.priority);

      const { requestFn, resolve, reject } = this.queue.shift();

      try {
        // Rate limiting: wait if needed
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.minInterval) {
          await this.delay(this.minInterval - timeSinceLastRequest);
        }

        const response = await requestFn();
        this.lastRequestTime = Date.now();
        resolve(response);
      } catch (error) {
        reject(error);
      }

      // Small delay between requests
      await this.delay(100);
    }

    this.processing = false;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Clear queue
  clear() {
    this.queue = [];
    this.processing = false;
  }

  // Get queue status
  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      lastRequestTime: this.lastRequestTime
    };
  }
}

// Global instance
export const apiRateLimiter = new APIRateLimiter();

// Helper function for making rate-limited API calls
export const makeRateLimitedRequest = async (url, priority = false) => {
  return apiRateLimiter.addRequest(async () => {
    const response = await fetch(url);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }, priority);
};
