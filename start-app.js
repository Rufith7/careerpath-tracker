#!/usr/bin/env node

/**
 * UNIFIED APPLICATION STARTUP SCRIPT
 * Starts both frontend and backend simultaneously with one command
 * Usage: node start-app.js or npm run dev
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Configuration
const config = {
  backend: {
    command: 'node',
    args: ['simple-server.js'],
    cwd: process.cwd(),
    name: 'Backend',
    color: colors.green,
    port: 5001
  },
  frontend: {
    command: 'npm',
    args: ['start'],
    cwd: path.join(process.cwd(), 'client'),
    name: 'Frontend',
    color: colors.blue,
    port: 3000,
    env: {
      BROWSER: 'none', // Prevent automatic browser opening
      CI: 'true' // Prevent interactive prompts
    }
  }
};

class AppLauncher {
  constructor() {
    this.processes = new Map();
    this.isShuttingDown = false;
    this.startupTimeout = 30000; // 30 seconds
  }

  log(message, color = colors.reset, prefix = '') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${color}[${timestamp}]${prefix ? ` [${prefix}]` : ''} ${message}${colors.reset}`);
  }

  async checkPrerequisites() {
    this.log('🔍 Checking prerequisites...', colors.yellow);
    
    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found in root directory');
    }

    // Check if client directory exists
    if (!fs.existsSync('client')) {
      throw new Error('client directory not found');
    }

    // Check if client/package.json exists
    if (!fs.existsSync('client/package.json')) {
      throw new Error('client/package.json not found');
    }

    // Check if simple-server.js exists
    if (!fs.existsSync('simple-server.js')) {
      throw new Error('simple-server.js not found');
    }

    this.log('✅ All prerequisites met', colors.green);
  }

  async startProcess(processConfig) {
    return new Promise((resolve, reject) => {
      const { command, args, cwd, name, color, port, env = {} } = processConfig;
      
      this.log(`🚀 Starting ${name}...`, color, name);
      
      const childProcess = spawn(command, args, {
        cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        env: { ...process.env, ...env }
      });

      let hasStarted = false;
      let startupTimer;

      // Set startup timeout
      startupTimer = setTimeout(() => {
        if (!hasStarted) {
          this.log(`❌ ${name} failed to start within ${this.startupTimeout/1000} seconds`, colors.red, name);
          childProcess.kill();
          reject(new Error(`${name} startup timeout`));
        }
      }, this.startupTimeout);

      // Handle stdout
      childProcess.stdout.on('data', (data) => {
        const output = data.toString();
        
        // Check for successful startup indicators
        if (!hasStarted) {
          const successIndicators = [
            'Server.*running.*port.*' + port,
            'webpack compiled',
            'Compiled successfully',
            'Compiled with warnings',
            'Local:.*localhost:' + port,
            'compiled successfully'
          ];
          
          if (successIndicators.some(indicator => new RegExp(indicator, 'i').test(output))) {
            hasStarted = true;
            clearTimeout(startupTimer);
            this.log(`✅ ${name} started successfully on port ${port}`, colors.green, name);
            resolve(childProcess);
          }
        }

        // Log output with color coding
        output.split('\n').forEach(line => {
          if (line.trim()) {
            this.log(line.trim(), color, name);
          }
        });
      });

      // Handle stderr
      childProcess.stderr.on('data', (data) => {
        const output = data.toString();
        output.split('\n').forEach(line => {
          if (line.trim()) {
            // Don't treat warnings as errors for frontend
            const isWarning = line.includes('warning') || line.includes('deprecated');
            const logColor = isWarning ? colors.yellow : colors.red;
            this.log(line.trim(), logColor, name);
          }
        });
      });

      // Handle process exit
      childProcess.on('close', (code) => {
        clearTimeout(startupTimer);
        if (code !== 0 && !this.isShuttingDown) {
          this.log(`❌ ${name} exited with code ${code}`, colors.red, name);
          reject(new Error(`${name} process failed`));
        } else if (!this.isShuttingDown) {
          this.log(`🔄 ${name} process ended`, colors.yellow, name);
        }
      });

      // Handle process errors
      childProcess.on('error', (error) => {
        clearTimeout(startupTimer);
        this.log(`❌ ${name} error: ${error.message}`, colors.red, name);
        reject(error);
      });

      // Store process reference
      this.processes.set(name, childProcess);
    });
  }

  async startAll() {
    try {
      await this.checkPrerequisites();
      
      this.log('🎯 Starting CareerPath Tracker Application...', colors.bright);
      this.log('📱 Frontend will be available at: http://localhost:3000', colors.cyan);
      this.log('🔧 Backend will be available at: http://localhost:5001', colors.cyan);
      this.log('👤 Demo login: demo@careerpath.com / demo123', colors.cyan);
      console.log(''); // Empty line for readability

      // Start backend first
      await this.startProcess(config.backend);
      
      // Wait a moment for backend to fully initialize
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Start frontend
      await this.startProcess(config.frontend);

      this.log('🎉 Application started successfully!', colors.bright);
      this.log('🌐 Open http://localhost:3000 in your browser', colors.cyan);
      console.log(''); // Empty line for readability
      this.log('Press Ctrl+C to stop all services', colors.yellow);

    } catch (error) {
      this.log(`❌ Failed to start application: ${error.message}`, colors.red);
      await this.shutdown();
      process.exit(1);
    }
  }

  async shutdown() {
    if (this.isShuttingDown) return;
    
    this.isShuttingDown = true;
    this.log('🛑 Shutting down application...', colors.yellow);

    const shutdownPromises = [];
    
    for (const [name, childProcess] of this.processes) {
      shutdownPromises.push(new Promise((resolve) => {
        this.log(`🔄 Stopping ${name}...`, colors.yellow, name);
        
        childProcess.on('close', () => {
          this.log(`✅ ${name} stopped`, colors.green, name);
          resolve();
        });

        // Try graceful shutdown first
        childProcess.kill('SIGTERM');
        
        // Force kill after 5 seconds
        setTimeout(() => {
          if (!childProcess.killed) {
            childProcess.kill('SIGKILL');
          }
        }, 5000);
      }));
    }

    await Promise.all(shutdownPromises);
    this.log('👋 Application stopped successfully', colors.green);
  }

  setupSignalHandlers() {
    // Handle Ctrl+C
    process.on('SIGINT', async () => {
      console.log(''); // New line after ^C
      await this.shutdown();
      process.exit(0);
    });

    // Handle termination
    process.on('SIGTERM', async () => {
      await this.shutdown();
      process.exit(0);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      this.log(`❌ Uncaught exception: ${error.message}`, colors.red);
      await this.shutdown();
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
      this.log(`❌ Unhandled rejection: ${reason}`, colors.red);
      await this.shutdown();
      process.exit(1);
    });
  }
}

// Main execution
async function main() {
  const launcher = new AppLauncher();
  launcher.setupSignalHandlers();
  await launcher.startAll();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AppLauncher;