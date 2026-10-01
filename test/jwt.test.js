import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import verifyJWT from '../src/utils/jwt.js';

// Test-only key; no deployment secrets or live services needed.
process.env.JWT_SECRET = 'ci-test-key-not-for-deployment';
test('accepts a signed token and preserves its user identity', () => {
  const token = jwt.sign({ id: 'user-123' }, process.env.JWT_SECRET);
  assert.equal(verifyJWT(token).id, 'user-123');
});
test('rejects a token signed with another key', () => {
  const token = jwt.sign({ id: 'user-123' }, 'wrong-key');
  assert.throws(() => verifyJWT(token), /invalid signature/);
});
test('rejects expired tokens', () => {
  const token = jwt.sign({ id: 'user-123', exp: 1 }, process.env.JWT_SECRET);
  assert.throws(() => verifyJWT(token), /jwt expired/);
});
test('rejects malformed tokens', () => {
  assert.throws(() => verifyJWT('invalid-token'), /jwt malformed/);
});
