# Contributing to Multi-Language Translation App

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/translation-app.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit and push
7. Create a Pull Request

## Development Setup

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker and Docker Compose (optional)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd translation-app

# Start development environment
chmod +x start.sh
./start.sh
```

## Project Structure

```
translation-app/
├── frontend/          # Next.js frontend
├── backend/           # FastAPI backend
├── deployment/        # Deployment configurations
├── docker-compose.yml # Docker orchestration
└── README.md          # Main documentation
```

## Code Style

### Frontend (TypeScript/React)
- Use TypeScript for all new files
- Follow ESLint rules: `npm run lint`
- Use functional components with hooks
- Use Tailwind CSS for styling
- Keep components small and focused

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints
- Format with Black: `black .`
- Sort imports with isort: `isort .`
- Add docstrings to functions and classes

## Making Changes

### Frontend Changes

1. Navigate to frontend directory:
```bash
cd frontend
npm install
npm run dev
```

2. Make your changes in:
   - `app/` - Pages and routes
   - `components/` - React components
   - `app/globals.css` - Global styles

3. Test your changes locally

### Backend Changes

1. Navigate to backend directory:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Make your changes in:
   - `main.py` - API endpoints
   - `translator.py` - Translation logic

3. Test your changes:
```bash
python main.py
```

## Adding New Features

### Adding a New Language

1. **Backend** (`backend/translator.py`):
   - Add model mapping to `marian_models` or use NLLB
   - Add language code to `nllb_lang_codes` if using NLLB
   - Update supported languages in `main.py`

2. **Frontend** (`frontend/app/page.tsx`):
   - Add language to `LANGUAGES` array with flag emoji

3. **Documentation**:
   - Update README.md with new language
   - Update API documentation

### Adding a New Model

1. Update `translator.py`:
   - Add model name to appropriate dictionary
   - Implement loading logic if needed
   - Update caching strategy

2. Test the new model:
   - Verify translation quality
   - Check memory usage
   - Measure inference speed

3. Update documentation:
   - List new model in README
   - Update resource requirements

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

### Integration Tests
```bash
# Start both services
docker-compose up

# Run integration tests
# (Add your integration test commands here)
```

## Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(frontend): add copy to clipboard functionality

Added a copy button that allows users to copy translations
to their clipboard with a single click.

Closes #123
```

```
fix(backend): resolve CORS error for production domains

Updated CORS configuration to properly handle production
domain requests.
```

## Pull Request Process

1. **Update Documentation**: Ensure README and other docs reflect your changes

2. **Add Tests**: Include tests for new features

3. **Check Code Style**: 
   - Frontend: `npm run lint`
   - Backend: `black .` and `isort .`

4. **Test Locally**: Verify everything works

5. **Create PR**: 
   - Use descriptive title
   - Reference related issues
   - Describe changes clearly
   - Add screenshots for UI changes

6. **Review Process**:
   - Address review comments
   - Keep PR updated with main branch
   - Be responsive to feedback

## Code Review

### For Reviewers
- Check code quality and style
- Verify tests are included
- Test changes locally
- Check documentation updates
- Be constructive and respectful

### For Contributors
- Respond promptly to feedback
- Be open to suggestions
- Ask questions if unclear
- Don't take criticism personally

## Adding Dependencies

### Frontend
```bash
cd frontend
npm install <package-name>
```
Update `package.json` with specific version

### Backend
```bash
cd backend
pip install <package-name>
pip freeze > requirements.txt
```

## Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying configuration
- Adding dependencies
- Changing deployment process

Documentation locations:
- Main README.md - Overview and quick start
- backend/README.md - Backend documentation
- frontend/README.md - Frontend documentation
- deployment/README.md - Deployment guides

## Security

### Reporting Security Issues
- Do NOT open public issues for security vulnerabilities
- Email security concerns to: [your-email]
- Include detailed description and steps to reproduce

### Security Guidelines
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Keep dependencies updated
- Follow OWASP guidelines
- Validate all user input

## Performance

### Guidelines
- Keep bundle sizes small
- Optimize images and assets
- Use lazy loading where appropriate
- Cache expensive operations
- Monitor memory usage

### Benchmarking
Test performance changes:
- Frontend: Lighthouse scores
- Backend: Load testing with locust or k6
- Monitor response times

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues and discussions first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🎉
