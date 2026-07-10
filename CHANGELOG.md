## [2.2.0] - 2026-07-10 (Minor Release)

### Added

### Changed

### Fixed

### Security

## [2.1.0] - 2026-07-10 (Minor Release)

### Added
- `setSessionTools` declared in the public TypeScript types (`VoiceAgentAPI`) — it was implemented but missing from `types.d.ts`, breaking TypeScript consumers.
- `setSessionTools` can now be called before the socket connects — the latest slug set is queued and flushed on connection.
- `session-tools-updated` server confirmation event is now handled (logged at debug level) instead of warning "Unknown event type".

### Fixed
- Broken type references in `types.d.ts`: `VoiceAgentStatus` → `ConnekzAgentStatus`, `ConnekzConversation` → `ConnekzTranscript`.
- Removed phantom `makeSleep` from the public types (it was never implemented).
- Removed the stale `./connekz-agent.css` package export — v2 injects styles at runtime and no CSS file ships in `dist/`. Consumers must remove `import '@connekz/connekz-agent/connekz-agent.css'`.

## [2.0.0] - 2026-06-23 (Major Release)

### Added
- Cross redis session support
- Support for multiple redis instances

## [1.5.2] - 2026-06-23 (Patch Release)

### Added

### Changed

- Minor lint cleanup in `Icon.vue` (quote style).

### Fixed

- Socket.IO now connects with `withCredentials: true` so the AWS ALB sticky-session cookie (`AWSALBCORS`, `SameSite=None`) is sent on cross-origin requests. Without it, long-polling sessions were routed to different backend instances behind the load balancer and failed with HTTP 400 ("Session ID unknown").
- `setCurrentConversationId` no longer resets the active audio batch when a repeated `THINKING` status arrives for the same conversation (prevents killing in-flight audio).

### Security

## [1.5.1] - 2026-04-01 (Patch Release)

### Added

### Changed

### Fixed

### Security

## [1.5.0] - 2026-04-01 (Minor Release)

### Security
- Security enhancements

## [1.4.1] - 2026-03-25 (Patch Release)

### Added
- On-demand tools and memory support

## [1.4.0] - 2026-03-25 (Minor Release)

### Security
- Security enhancements

## [1.3.7] - 2026-02-24 (Patch Release)

### Fixed
- RTT probe set to use Connekz CDN.

## [1.3.6] - 2026-02-24 (Patch Release)

### Changed
- internet speed monitor improved

## [1.3.5] - 2026-02-18 (Patch Release)

### Changed
- error handling improved

## [1.3.4] - 2026-02-18 (Patch Release)

### Added
- auto socket connection setup added

## [1.3.3] - 2026-02-18 (Patch Release)

### Added
- auto socket connection setup added

## [1.3.2] - 2026-02-16 (Patch Release)

### Changed
- Network speed measurement improved

All notable changes to @connekz/connekz-agent will be documented in this file.

## [1.3.1] - 2026-02-16
### Added
- Further voice improvements v1.1

## [1.3.0] - 2026-02-16
### Added
- Further voice improvements v1.0

## [1.2.6] - 2026-02-16
### Added
- Mic health monitoring setup added

## [1.2.6] - 2026-02-15
### Fixed
- Audio pickup issue fix v1.0

## [1.2.6] - 2026-02-15
### Fixed
- UI issue fixes v1.0

## [1.2.6] - 2026-02-06
### Fixed
- Signal strength monitor added

## [1.2.5] - 2026-02-06
### Fixed
- voice conversation termination optimized

## [1.2.4] - 2026-01-26
### Fixed
- voice conversation termination optimized

## [1.2.3] - 2026-01-26
### Fixed
- voice conversation termination optimized

## [1.2.2] - 2026-01-26
### Fixed
- voice conversation termination optimized

## [1.2.1] - 2026-01-26
### Fixed
- agent start bug fix v1.3

## [1.2.0] - 2026-01-26
### Fixed
- Agent starting bug fix
- Agent transcript showing bug fix

## [1.0.0] - 2026-01-26
### Added
- Initial release.
