# ==============================================================================
# DEVELOPMENT SETUP
# ==============================================================================

.PHONY: init-dev
init-dev:
	@echo "Installing expo..."
	@npm install expo
	@echo "Copying PowerSync web assets..."
	@npx powersync-web copy-assets
	@if [ -f ".env" ]; then \
		echo ".env already exists, skipping..."; \
	else \
		cp .env.example .env && \
		echo "Created .env from .env.example"; \
	fi

.PHONY: clean-dev
clean-dev:
	@echo "Cleaning build artifacts and dependencies..."
	@if [ -d ".expo" ]; then rm -rf .expo && echo "Removed .expo"; fi
	@if [ -d "node_modules" ]; then rm -rf node_modules && echo "Removed node_modules"; fi
	@if [ -d "ios" ]; then rm -rf ios && echo "Removed ios"; fi
	@if [ -d "android" ]; then rm -rf android && echo "Removed android"; fi
	@if [ -d "public/@powersync" ]; then rm -rf public/@powersync && echo "Removed public/@powersync"; fi
	@echo "Clean completed!"

# ==============================================================================
# QUALITY ASSURANCE (Can be run by CI)
# ==============================================================================

.PHONY: lint
lint:
	@echo "Running ESLint ..."
	@npx expo lint

.PHONY: format
format:
	@echo "Checking code formatting with Prettier..."
	@npx prettier --check .

.PHONY: audit
audit:
	@echo "Running npm audit for security vulnerabilities..."
	@npm audit
	@echo "Security audit completed."

.PHONY: extraction
extraction:
	@npx i18next-cli status

.PHONY: ci-static
ci-static: lint format audit extraction
	@echo "==========================================="
	@echo "Quality Gate Passed. Ready for Build."
	@echo "==========================================="

# ==============================================================================
# FORMATTING & FIXES (Often run by developers locally)
# ==============================================================================

.PHONY: fix-lint
fix-lint:
	@echo "Running ESLint autofix..."
	@npx expo lint --fix

.PHONY: fix-format
fix-format:
	@echo "Running Prettier autofix..."
	@npx prettier --write .

.PHONY: fix-extraction
fix-extraction:
	@npx i18next-cli extract

.PHONY: fix-all
fix-all: 
	@echo "Running all fixes..."
	@make fix-lint
	@make fix-format
	@make fix-extraction