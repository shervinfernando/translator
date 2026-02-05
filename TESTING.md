# Testing Guide

This document provides comprehensive testing guidelines for the Multi-Language Translation App.

## Testing Strategy

### Test Levels
1. **Unit Tests** - Individual functions and components
2. **Integration Tests** - API endpoints and service interactions
3. **E2E Tests** - Complete user workflows
4. **Performance Tests** - Load and stress testing
5. **Security Tests** - Vulnerability scanning

## Quick Test Commands

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest

# Docker compose test environment
docker-compose --profile test up
```

## Frontend Testing

### Unit Tests (Jest + React Testing Library)

**Setup:**
```bash
cd frontend
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Example test file:** `components/__tests__/LanguageSelector.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from '../LanguageSelector';

const mockLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
];

describe('LanguageSelector', () => {
  it('renders correctly', () => {
    render(
      <LanguageSelector
        value="en"
        onChange={() => {}}
        languages={mockLanguages}
      />
    );
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const handleChange = jest.fn();
    render(
      <LanguageSelector
        value="en"
        onChange={handleChange}
        languages={mockLanguages}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'ja' } });
    expect(handleChange).toHaveBeenCalledWith('ja');
  });
});
```

### Component Tests

Test each component:
- `LanguageSelector` - Selection and change events
- `TranslationBox` - Input, readonly mode, character count
- `SwapButton` - Click events, disabled state

### E2E Tests (Playwright)

**Setup:**
```bash
cd frontend
npm install --save-dev @playwright/test
npx playwright install
```

**Example E2E test:** `e2e/translation.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test('complete translation flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Select languages
  await page.selectOption('[data-testid="source-lang"]', 'en');
  await page.selectOption('[data-testid="target-lang"]', 'ja');
  
  // Enter text
  await page.fill('[data-testid="source-text"]', 'Hello, world!');
  
  // Click translate
  await page.click('[data-testid="translate-button"]');
  
  // Wait for translation
  await page.waitForSelector('[data-testid="translated-text"]');
  
  // Verify translation exists
  const translatedText = await page.textContent('[data-testid="translated-text"]');
  expect(translatedText).toBeTruthy();
  expect(translatedText).not.toBe('');
});

test('swap languages functionality', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  await page.fill('[data-testid="source-text"]', 'Test text');
  await page.click('[data-testid="swap-button"]');
  
  const sourceText = await page.inputValue('[data-testid="source-text"]');
  expect(sourceText).toBe('');
});
```

## Backend Testing

### Unit Tests (pytest)

**Setup:**
```bash
cd backend
pip install pytest pytest-asyncio httpx
```

**Example test file:** `tests/test_translator.py`
```python
import pytest
from translator import TranslationService

@pytest.fixture
def translator():
    return TranslationService(cache_dir="./test_models")

def test_same_language_passthrough(translator):
    result = translator.translate("Hello", "en", "en")
    assert result["translated_text"] == "Hello"
    assert result["model_used"] == "pass-through"

def test_empty_text(translator):
    result = translator.translate("", "en", "ja")
    assert result["translated_text"] == ""
    assert result["model_used"] == "none"

def test_translation_en_to_ja(translator):
    result = translator.translate("Hello", "en", "ja")
    assert result["translated_text"] != ""
    assert "translated_text" in result
    assert "model_used" in result
```

**API tests:** `tests/test_main.py`
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "version" in response.json()

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_languages_endpoint():
    response = client.get("/languages")
    assert response.status_code == 200
    assert len(response.json()["languages"]) == 5

def test_translate_endpoint():
    response = client.post(
        "/translate",
        json={
            "text": "Hello, world!",
            "source_lang": "en",
            "target_lang": "ja"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "translated_text" in data
    assert "model_used" in data
    assert data["translated_text"] != ""

def test_translate_invalid_language():
    response = client.post(
        "/translate",
        json={
            "text": "Hello",
            "source_lang": "invalid",
            "target_lang": "ja"
        }
    )
    assert response.status_code == 400

def test_translate_empty_text():
    response = client.post(
        "/translate",
        json={
            "text": "",
            "source_lang": "en",
            "target_lang": "ja"
        }
    )
    assert response.status_code == 400
```

### Running Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_translator.py

# Run with verbose output
pytest -v

# Run and show print statements
pytest -s
```

## Integration Tests

### API Integration Tests

Test the complete flow from frontend to backend:

```python
# tests/integration/test_translation_flow.py
import requests
import pytest

BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_backend_to_frontend_integration():
    # Test backend directly
    backend_response = requests.post(
        f"{BACKEND_URL}/translate",
        json={
            "text": "Hello, world!",
            "source_lang": "en",
            "target_lang": "ja"
        }
    )
    assert backend_response.status_code == 200
    
    # Test frontend API route
    frontend_response = requests.post(
        f"{FRONTEND_URL}/api/translate",
        json={
            "text": "Hello, world!",
            "source_lang": "en",
            "target_lang": "ja"
        }
    )
    assert frontend_response.status_code == 200
    
    # Compare results
    assert backend_response.json()["translated_text"] == \
           frontend_response.json()["translated_text"]
```

## Performance Testing

### Load Testing with Locust

**Setup:**
```bash
pip install locust
```

**Load test file:** `tests/load/locustfile.py`
```python
from locust import HttpUser, task, between

class TranslationUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def translate_en_to_ja(self):
        self.client.post("/translate", json={
            "text": "Hello, world!",
            "source_lang": "en",
            "target_lang": "ja"
        })
    
    @task(2)
    def translate_ja_to_en(self):
        self.client.post("/translate", json={
            "text": "こんにちは",
            "source_lang": "ja",
            "target_lang": "en"
        })
    
    @task(1)
    def get_health(self):
        self.client.get("/health")
```

**Run load test:**
```bash
locust -f tests/load/locustfile.py --host http://localhost:8000
```

Visit http://localhost:8089 for the web interface.

### Performance Benchmarks

Target metrics:
- **Response time**: < 3 seconds (p95)
- **Throughput**: > 10 requests/second (single instance)
- **Error rate**: < 1%
- **Memory usage**: < 4GB (backend)
- **CPU usage**: < 80%

## Security Testing

### Vulnerability Scanning

**Backend:**
```bash
# Check for known vulnerabilities in dependencies
pip install safety
safety check

# Security linting
pip install bandit
bandit -r .
```

**Frontend:**
```bash
# Check for known vulnerabilities
npm audit

# Fix automatically
npm audit fix
```

### Penetration Testing Checklist

- [ ] SQL Injection (N/A - no SQL)
- [ ] XSS (Cross-Site Scripting)
- [ ] CSRF (Cross-Site Request Forgery)
- [ ] CORS misconfigurations
- [ ] API authentication bypass
- [ ] Rate limiting bypass
- [ ] Input validation bypass
- [ ] File upload vulnerabilities (when implemented)

### Security Test Cases

```python
# tests/security/test_security.py
def test_xss_prevention():
    response = client.post("/translate", json={
        "text": "<script>alert('xss')</script>",
        "source_lang": "en",
        "target_lang": "ja"
    })
    # Should not execute script
    assert "<script>" not in response.json()["translated_text"]

def test_sql_injection_attempt():
    response = client.post("/translate", json={
        "text": "'; DROP TABLE users; --",
        "source_lang": "en",
        "target_lang": "ja"
    })
    # Should handle safely
    assert response.status_code in [200, 400]

def test_oversized_input():
    large_text = "a" * 10000
    response = client.post("/translate", json={
        "text": large_text,
        "source_lang": "en",
        "target_lang": "ja"
    })
    # Should reject or handle appropriately
    assert response.status_code in [200, 400, 413]
```

## Manual Testing Checklist

### Frontend
- [ ] All pages load correctly
- [ ] Language selectors work
- [ ] Text input accepts various scripts (Latin, Japanese, etc.)
- [ ] Translation button triggers translation
- [ ] Loading state displays during translation
- [ ] Error messages display appropriately
- [ ] Copy button works
- [ ] Clear button resets form
- [ ] Swap button reverses languages
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile
- [ ] Character counter updates in real-time

### Backend
- [ ] API documentation accessible at /docs
- [ ] Health endpoint returns status
- [ ] Translation endpoint works for all language pairs
- [ ] Error handling works for invalid inputs
- [ ] CORS headers allow frontend requests
- [ ] Models load successfully
- [ ] Translation quality is acceptable
- [ ] Response times are acceptable

### Language Pairs
Test all combinations:
- [ ] English ↔ Japanese
- [ ] English ↔ Mandarin
- [ ] English ↔ Hindi
- [ ] English ↔ Sinhala
- [ ] Japanese ↔ Mandarin (via English)
- [ ] Other cross-language pairs

## CI/CD Testing

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && npm test
      - name: Run linter
        run: cd frontend && npm run lint

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: cd backend && pip install -r requirements.txt
      - name: Run tests
        run: cd backend && pytest
      - name: Run linter
        run: cd backend && flake8 .
```

## Test Coverage

### Coverage Goals
- Backend: > 80%
- Frontend: > 70%
- Critical paths: 100%

### Generate Coverage Reports

**Backend:**
```bash
cd backend
pytest --cov=. --cov-report=html --cov-report=term
open htmlcov/index.html
```

**Frontend:**
```bash
cd frontend
npm test -- --coverage
open coverage/lcov-report/index.html
```

## Debugging Tests

### Backend Debugging
```bash
# Run pytest with debugging
pytest --pdb

# Run specific test with print output
pytest -s tests/test_translator.py::test_translation_en_to_ja
```

### Frontend Debugging
```bash
# Run tests in watch mode
npm test -- --watch

# Debug in VS Code
# Add to .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/frontend/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

## Continuous Testing

### Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit

# Create .pre-commit-config.yaml
# Run on all files
pre-commit run --all-files
```

### Test Before Deploy

Always run before deploying:
```bash
# Full test suite
./run-all-tests.sh

# Backend
cd backend && pytest

# Frontend
cd frontend && npm test && npm run lint && npm run build

# Integration
docker-compose up -d
# Run integration tests
docker-compose down
```

## Reporting Issues

When reporting test failures, include:
1. Test name and file
2. Error message and stack trace
3. Environment details (OS, versions)
4. Steps to reproduce
5. Expected vs actual behavior

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Locust Documentation](https://docs.locust.io/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
