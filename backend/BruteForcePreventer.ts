export default class BruteForcePreventer {
  #failures = new Map();
  #delayStep;

  constructor(
    delayStep = 2000,
  ) {
    this.#delayStep = delayStep;
    // Clean up people that have given up
    const MINS10 = 600000;
    const MINS30 = 3 * MINS10;

    setInterval(() => {
      for (const ip in this.#failures) {
        if (Date.now() - this.#failures.get(ip).nextTry > MINS10) {
          this.#failures.delete(ip);
        }
      }
    }, MINS30);
  }


  successfulLogin(remoteIp) {
    this.#failures.delete(remoteIp);
  }


  isLoginAttemptLegit(remoteIp) {
    if (this.#failures.has(remoteIp)){
      const failuresOfIp = this.#failures.get(remoteIp);
      if (Date.now() < failuresOfIp.nextTry) {
        // Throttled. Can't try yet.
        return false;
      }
    }
  
    // Otherwise login attempt is allowed
    return true;
  }


  unsuccessfulLogin(remoteIp) {
    if (this.#failures.has(remoteIp)) {
      const failuresOfIp = this.#failures.get(remoteIp);
      failuresOfIp.count++;
      // Wait another two seconds for every failed attempt but not more than 20s
      const delay = this.#delayStep * failuresOfIp.count;
      failuresOfIp.nextTry = Date.now() + delay;
    } else {
      this.#failures.set(remoteIp, {
        count: 1,
        nextTry: new Date() + this.#delayStep,
      });
    }
  }

}

