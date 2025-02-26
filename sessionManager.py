import time
import threading

class LightweightRedis:
    def __init__(self, cleanup_interval=1):
        """
        Initialize the key-value store with an optional cleanup interval.
        :param cleanup_interval: Time (in seconds) between each cleanup operation.
        """
        self.store = {}
        self.lock = threading.Lock()
        self.cleanup_interval = cleanup_interval
        self.running = True
        self.cleanup_thread = threading.Thread(target=self._cleanup_expired_keys, daemon=True)
        self.cleanup_thread.start()

    def set(self, key, value, ttl=None):
        """
        Store a key-value pair with an optional time-to-live (ttl) in seconds.
        :param key: Key to store.
        :param value: Value to store.
        :param ttl: Time-to-live in seconds. If None, the key will not expire.
        """
        with self.lock:
            expire_time = time.time() + ttl if ttl else None
            self.store[key] = (value, expire_time)

    def get(self, key):
        """
        Retrieve a value by key.
        :param key: Key to retrieve.
        :return: Value if the key exists and has not expired, else None.
        """
        with self.lock:
            if key in self.store:
                value, expire_time = self.store[key]
                if not expire_time or expire_time > time.time():
                    return value
                else:
                    del self.store[key]  # Remove expired key
        return None

    def delete(self, key):
        """
        Delete a key-value pair.
        :param key: Key to delete.
        """
        with self.lock:
            if key in self.store:
                del self.store[key]
                return True
        return False

    def _cleanup_expired_keys(self):
        """
        Background thread to clean up expired keys.
        """
        while self.running:
            with self.lock:
                current_time = time.time()
                keys_to_delete = [key for key, (_, expire_time) in self.store.items()
                                  if expire_time and expire_time <= current_time]
                for key in keys_to_delete:
                    del self.store[key]
            time.sleep(self.cleanup_interval)

    def stop(self):
        """
        Stop the cleanup thread.
        """
        self.running = False
        self.cleanup_thread.join()

    def get_stats(self):
        """
        Print the Table (Key, Value, Expire Time)
        """
        with self.lock:
            print("Session ID\t\t\t\t\tStatus\t\t\tExpire Time")
            for session_id, (status, expire_time) in self.store.items():
                print(f"{session_id}\t\t{status}\t\t\t{expire_time}")
        print()
