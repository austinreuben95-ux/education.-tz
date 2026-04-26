# Firebase Security Specification - Education TZ

## 1. Data Invariants
- A `UserProgress` document must always have a `userId` that matches the authenticated user's UID.
- `points`, `streak`, and `level` must be numbers.
- `completedTopics` must be an array of strings.
- Users can only read and write their own progress data.
- Only admins can write to the `admins` collection (system-level).

## 2. The "Dirty Dozen" Payloads (Attacks)

| ID | Target Path | Payload | Attack Type | Expected |
|----|-------------|---------|-------------|----------|
| 1 | `users/attacker_uid` | `{ points: 100000, userId: 'victim_uid' }` | Identity Spoofing | Denied |
| 2 | `users/victim_uid` | `{ points: 0 }` | Unauthorized Write | Denied |
| 3 | `users/my_uid` | `{ points: 'lots', userId: 'my_uid' }` | Type Poisoning | Denied |
| 4 | `users/my_uid` | `{ points: 100, userId: 'my_uid', extraField: 'hacker' }` | Resource Poisoning | Denied |
| 5 | `users/my_uid` | `{ points: -1, userId: 'my_uid' }` | Boundary Violation | Denied |
| 6 | `admins/my_uid` | `{ uid: 'my_uid', email: 'me@evil.com' }` | Privilege Escalation | Denied |
| 7 | `users/../admins/1` | `{ ... }` | Path Traversal | Denied |
| 8 | `users/my_uid` | `{ completedTopics: 'math' }` | Type Poisoning (Array) | Denied |
| 9 | `users/my_uid` | `{ streak: 999999 }` | Logic Abuse | Denied (if rules capped) |
| 10 | `users/my_uid` | `delete` | Data Destruction | Denied (No delete rule) |
| 11 | `users/my_uid` | `{ userId: 'my_uid', points: 100 }` (missing level/streak) | Schema Break | Denied |
| 12 | `users/my_uid` | `{ points: 200, userId: 'my_uid', isAdmin: true }` | Shadow Update | Denied |

## 3. Test Runner (Conceptual)
Tests are implemented in `firestore.rules.test.ts`.
- `test('unauthenticated users cannot read/write')`
- `test('users can only access their own documents')`
- `test('schema validation blocks malformed data')`
