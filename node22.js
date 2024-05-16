name: "Test Installation Scripts"

on:
  schedule:
    - cron: "00 00 * * *"
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  deb:
    name: "NodeJS ${{ matrix.version }}(${{ matrix.os }})"
    runs-on: ubuntu-latest
    strategy:
      matrix:
        version: [18, 20, 21, 22]
        os: ["ubuntu:22.04", "debian:10"]
    container:
      image: ${{ matrix.os }}
    defaults:
      run:
        shell: bash
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Run Istallation Script
        run: ./scripts/deb/setup_${{ matrix.version }}.x

      - name: Install Nodejs
        run: |
          apt-get install nodejs -y

      - name: Validate Node Version
        run: |
          node -e "console.log(process.version)"
          NODE_VERSION=$(node -e "console.log((process.version).split('.')[0])")
          if [[ ${NODE_VERSION} != "v${{ matrix.version }}" ]]; then
            echo "Node version is not ${{ matrix.version }}. It is $NODE_VERSION"
            exit 1
          fi

  rpm:
    name: "NodeJS ${{ matrix.version }}(${{ matrix.os }})"
    runs-on: ubuntu-latest
    strategy:
      matrix:
        version: [18, 20, 21, 22]
        os: ["fedora:36", "amazonlinux:2023", "rockylinux:9", "redhat/ubi9:latest"]
    container:
      image: ${{ matrix.os }}
    defaults:
      run:
        shell: bash
    steps:
      - name: install git
        run: |
          dnf update -y
          dnf install git -y

      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Run Istallation Script
        run: ./scripts/rpm/setup_${{ matrix.version }}.x

      - name: Install Nodejs
        run: |
          dnf install nodejs -y

      - name: Validate Node Version
        run: |
          node -e "console.log(process.version)"
          NODE_VERSION=$(node -e "console.log((process.version).split('.')[0])")
          if [[ ${NODE_VERSION} != "v${{ matrix.version }}" ]]; then
            echo "Node version is not ${{ matrix.version }}. It is $NODE_VERSION"
            exit 1
          fi

  rpm-minimal:
    name: "NodeJS ${{ matrix.version }}(${{ matrix.os }})"
    runs-on: ubuntu-latest
    strategy:
      matrix:
        version: [18, 20, 21, 22]
        os: ["rockylinux:9-minimal", "redhat/ubi9-minimal:latest"]
    container:
      image: ${{ matrix.os }}
    defaults:
      run:
        shell: bash
    steps:
      - name: install git
        run: |
          microdnf update -y
          microdnf install git -y

      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Run Istallation Script
        run: ./scripts/rpm/setup_${{ matrix.version }}.x

      - name: Install Nodejs
        run: |
          microdnf install nodejs -y

      - name: Validate Node Version
        run: |
          node -e "console.log(process.version)"
          NODE_VERSION=$(node -e "console.log((process.version).split('.')[0])")
          if [[ ${NODE_VERSION} != "v${{ matrix.version }}" ]]; then
            echo "Node version is not ${{ matrix.version }}. It is $NODE_VERSION"
            exit 1
          fi
