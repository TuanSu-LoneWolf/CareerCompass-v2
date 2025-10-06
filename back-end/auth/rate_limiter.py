import time
from functools import wraps
from flask import request, jsonify
from collections import defaultdict
import logging

# Import config with fallback
try:
    from config.config import Config
except ImportError:
    import sys
    import os
    # Đây là import từ Back-end/config
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from config.config import Config

class InMemoryRateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
    
    def is_allowed(self, key, limit, window):
        now = time.time()
        # Remove old requests outside window
        self.requests[key] = [req_time for req_time in self.requests[key] if now - req_time < window]
        
        if len(self.requests[key]) >= limit:
            return False, len(self.requests[key])
        
        self.requests[key].append(now)
        return True, len(self.requests[key])

# Global rate limiter instance
rate_limiter = InMemoryRateLimiter()

def rate_limit(limit=60, window=3600, per_user=True):
    """
    Rate limiting decorator
    limit: số requests allowed
    window: time window in seconds  
    per_user: True = per user, False = per IP
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            
            # Mọi user đều dùng limit mặc định (ĐÃ LOẠI BỎ LOGIC PREMIUM)
            limit_adjusted = limit 
            
            if per_user and hasattr(request, 'current_user'):
                key = f"user:{request.current_user['user_id']}:{f.__name__}"
            else:
                key = f"ip:{request.remote_addr}:{f.__name__}"
            
            allowed, current_count = rate_limiter.is_allowed(key, limit_adjusted, window)
            
            if not allowed:
                return jsonify({
                    'error': 'Rate limit exceeded',
                    'limit': limit_adjusted,
                    'window': window,
                    'current_count': current_count
                }), 429
            
            return f(*args, **kwargs)
        return decorated
    return decorator