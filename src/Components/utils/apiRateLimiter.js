class ApiRateLimiter {
  constructor() {
    this.requestTimestamps = new Map();
    this.pendingRequests = new Map();
    this.minInterval = 2000; // 2 ثانية بين كل طلب لنفس الـ endpoint
  }

  async throttle(key, apiCall, force = false) {
    const now = Date.now();
    const lastRequest = this.requestTimestamps.get(key) || 0;
    const timeSinceLastRequest = now - lastRequest;

    // إذا كان هناك طلب معلق لنفس الـ key، انتظره
    if (this.pendingRequests.has(key)) {
      console.log(`⏳ انتظار طلب معلق: ${key}`);
      return this.pendingRequests.get(key);
    }

    // إذا كان الطلب سريع جداً ومش مجبر
    if (!force && timeSinceLastRequest < this.minInterval) {
      console.log(`🚫 تم تجاهل الطلب (سريع جداً): ${key}`);
      const waitTime = this.minInterval - timeSinceLastRequest;
      console.log(`⏱️ يجب الانتظار ${waitTime}ms`);
      return { 
        success: false, 
        rateLimited: true,
        message: 'Too many requests',
        waitTime 
      };
    }

    // تنفيذ الطلب
    this.requestTimestamps.set(key, now);
    const requestPromise = apiCall();
    this.pendingRequests.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  reset(key) {
    this.requestTimestamps.delete(key);
    this.pendingRequests.delete(key);
  }

  resetAll() {
    this.requestTimestamps.clear();
    this.pendingRequests.clear();
  }
}

export const apiRateLimiter = new ApiRateLimiter();