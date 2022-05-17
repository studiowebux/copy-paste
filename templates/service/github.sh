#!/bin/bash

cat >.github/workflows/ci_features.yaml <<EOL
name: Continuous Integration

on:
  push:
    branches:
      - feature/*
    paths:
      - services/**
  pull_request:
  workflow_dispatch:

env:
  AWS_REGION: "$AWS_REGION"

jobs:
  lambdas-ci:
    name: CI lambdas
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_KEY }}
          aws-region: \${{ env.AWS_REGION }}

      - name: Create Github Configuration
        run: |
          echo "@webuxlab:registry=https://npm.pkg.github.com/" > ~/.npmrc
          echo "//npm.pkg.github.com/:_authToken=\${{ secrets.REGISTRY_TOKEN }}" >> ~/.npmrc

      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: 12.x

      - name: Lambda CI
        uses: ./actions/lambda-ci

EOL

cat >actions/lambda-ci/action.yml <<EOL
name: "Continuous Integration - Lambda"
description: "Lambda CI"
runs:
  using: "composite"
  steps:
    - name: Install project root dependencies (Especially lerna)
      shell: bash
      run: npm ci
    - name: Install dependencies
      shell: bash
      run: npm run install
    - name: Run Linter
      shell: bash
      run: npm run lint
    - name: Run Audit
      shell: bash
      run: npm run audit
    - name: Run Tests
      shell: bash
      run: npm run test
      env:
        CI: true

EOL
