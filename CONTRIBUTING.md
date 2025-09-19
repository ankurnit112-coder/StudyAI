# 🤝 Contributing to StudyAI

Thank you for your interest in contributing to StudyAI! We welcome contributions from developers, educators, and students who want to help improve CBSE board exam preparation through AI.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.9+ (for backend contributions)
- Git
- Basic knowledge of React/Next.js and Python/FastAPI

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/StudyAI.git
   cd StudyAI
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend (optional)
   cd backend
   pip install -r requirements.txt
   ```

3. **Start development servers**
   ```bash
   # Frontend
   npm run dev
   
   # Backend (in separate terminal)
   cd backend
   python start.py
   ```

## 📋 How to Contribute

### 🐛 Bug Reports
- Use the GitHub issue tracker
- Include steps to reproduce
- Provide screenshots if applicable
- Mention your browser/OS version

### ✨ Feature Requests
- Check existing issues first
- Describe the feature clearly
- Explain the use case and benefits
- Consider implementation complexity

### 💻 Code Contributions

#### Frontend (Next.js/React)
- Follow TypeScript best practices
- Use existing UI components from `components/ui/`
- Ensure mobile responsiveness
- Add proper error handling

#### Backend (Python/FastAPI)
- Follow PEP 8 style guidelines
- Add type hints for all functions
- Include docstrings for new functions
- Write tests for new endpoints

#### ML Models
- Document model changes thoroughly
- Include performance metrics
- Test with sample data
- Update training scripts if needed

## 🔄 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests where appropriate

3. **Test your changes**
   ```bash
   # Frontend
   npm run build
   npm run lint
   
   # Backend
   python -m pytest tests/
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

## 📝 Code Style Guidelines

### Frontend
- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states for async operations

### Backend
- Use type hints for all function parameters and returns
- Follow FastAPI patterns for route handlers
- Implement proper error handling
- Add comprehensive logging

### General
- Write clear, descriptive commit messages
- Keep functions small and focused
- Add comments for complex logic
- Update documentation for new features

## 🧪 Testing

### Frontend Testing
```bash
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
npm run lint         # Code linting
```

### Backend Testing
```bash
python -m pytest tests/           # Unit tests
python test_system.py            # Integration tests
```

## 📚 Documentation

- Update README.md for new features
- Add JSDoc comments for complex functions
- Update API documentation for backend changes
- Include examples in documentation

## 🎯 Areas We Need Help With

### High Priority
- **Accessibility improvements** - WCAG compliance
- **Performance optimization** - Bundle size, loading times
- **Mobile UX enhancements** - Touch interactions, responsive design
- **Test coverage** - Unit and integration tests

### Medium Priority
- **Internationalization** - Support for regional languages
- **Advanced analytics** - More detailed performance insights
- **Study recommendations** - Enhanced AI-driven suggestions
- **Offline functionality** - Better PWA features

### Low Priority
- **UI/UX improvements** - Design enhancements
- **Code refactoring** - Technical debt reduction
- **Documentation** - Tutorials and guides

## 🚫 What We Don't Accept

- Breaking changes without discussion
- Code without proper testing
- Features that compromise user privacy
- Contributions that don't follow our code style
- Plagiarized or copyrighted content

## 📞 Getting Help

- **GitHub Discussions** - For general questions
- **GitHub Issues** - For bug reports and feature requests
- **Code Review** - We'll provide feedback on all PRs

## 🏆 Recognition

Contributors will be:
- Listed in our contributors section
- Mentioned in release notes for significant contributions
- Invited to join our contributor community

## 📄 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a positive environment

Thank you for contributing to StudyAI! Together, we can help students excel in their CBSE board examinations. 🎓