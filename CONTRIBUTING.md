# Contributing to OBS Scene Builder

Thank you for your interest in contributing to OBS Scene Builder! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/obs-scene-builder.git`
3. Install dependencies: `npm install`
4. Set up the database (see README.md)
5. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes
2. Test your changes thoroughly
3. Run type checking: `npm run type-check`
4. Run linting: `npm run lint`
5. Build the project: `npm run build`
6. Commit your changes with a clear message
7. Push to your fork
8. Create a Pull Request

## Code Style

### TypeScript
- Use TypeScript for all new code
- Define types in `/types` directory
- Avoid `any` type when possible
- Use interfaces for object shapes

### React Components
- Use functional components with hooks
- Server components by default, add `'use client'` directive when needed
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

### Naming Conventions
- Components: PascalCase (e.g., `SceneCanvas.tsx`)
- Functions: camelCase (e.g., `handleUpdateElement`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_WIDTH`)
- Types/Interfaces: PascalCase (e.g., `SceneElement`)

### File Organization
```
/app          - Next.js pages and API routes
/components   - Reusable React components
/lib          - Utilities, database, and business logic
  /db         - Database client and queries
  /utils      - Helper functions
  /hooks      - Custom React hooks
/types        - TypeScript type definitions
/docs         - Documentation
```

## Database Changes

If you need to modify the database schema:

1. Update `/lib/db/schema.sql`
2. Create a migration script in `/lib/db/migrations/` (future)
3. Update TypeScript types in `/types/obs.ts`
4. Update queries in `/lib/db/queries.ts`
5. Document the changes in your PR

## Adding New Element Types

To add a new OBS element type:

1. Add type to `ElementType` in `/types/obs.ts`
2. Add properties interface to `SceneElementProperties`
3. Update `mapElementTypeToOBS()` in `/lib/utils/scene-storage.ts`
4. Update `mapOBSTypeToElement()` in `/lib/utils/scene-storage.ts`
5. Add icon to `getElementIcon()` in `/components/SceneCanvas.tsx`
6. Add rendering logic to `LivePreview.tsx`
7. Add to `elementTypes` array in `/components/ElementPanel.tsx`
8. Add property editors in `/components/PropertiesPanel.tsx`
9. Update documentation in `/docs/OBS_FORMAT.md`

## Testing

Currently, testing is manual. Future contributions should include:
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows

## Pull Request Guidelines

### PR Title
Use conventional commit format:
- `feat: Add new element type for alerts`
- `fix: Correct rotation transform calculation`
- `docs: Update setup instructions`
- `refactor: Simplify scene storage logic`
- `style: Format code with prettier`
- `test: Add tests for element panel`

### PR Description
Include:
- What changes were made and why
- How to test the changes
- Screenshots/videos for UI changes
- Related issue numbers

### Checklist
- [ ] Code follows project style guidelines
- [ ] TypeScript types are properly defined
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes are documented
- [ ] Self-review completed

## Common Issues

### Database Connection Errors
- Ensure PostgreSQL is running
- Check `.env.local` configuration
- Verify database exists: `psql -l`
- Re-initialize schema if needed

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)

### Type Errors
- Run `npm run type-check` for detailed errors
- Ensure all types are properly imported
- Check for missing type definitions

## Feature Requests

For feature requests:
1. Check existing issues first
2. Open a new issue with "Feature Request" label
3. Describe the feature and use case
4. Discuss implementation approach
5. Wait for maintainer feedback before starting work

## Bug Reports

For bug reports:
1. Check if the bug is already reported
2. Include steps to reproduce
3. Include expected vs actual behavior
4. Include screenshots/videos if applicable
5. Include environment details (OS, Node version, etc.)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Follow GitHub's community guidelines

## Questions?

- Open an issue with the "question" label
- Check existing documentation
- Review closed issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
