import { Injectable } from '@angular/core';
import { ChecklistItem, CategoryInfo, CategoryType } from '../models/checklist.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  private readonly STORAGE_KEY = 'securecheck-progress';

  private categories: CategoryInfo[] = [
    {
      type: 'personal',
      label: 'Personal Security',
      icon: '🔐',
      description: 'Protect your accounts and personal data'
    },
    {
      type: 'device',
      label: 'Device Security',
      icon: '💻',
      description: 'Keep your devices safe and up to date'
    },
    {
      type: 'network',
      label: 'Network Security',
      icon: '🌐',
      description: 'Secure your connections and network'
    }
  ];

  private checklistItems: ChecklistItem[] = [
    // Personal Security
    {
      id: 'p1',
      title: 'Use a password manager',
      description: 'Store all passwords in an encrypted password manager instead of reusing them.',
      category: 'personal',
      riskLevel: 'high',
      completed: false,
      tip: 'Reused passwords are the #1 cause of account breaches.',
      howTo: 'Choose a manager like Bitwarden, 1Password, or KeePass. Import your existing passwords and generate new unique ones for each account.'
    },
    {
      id: 'p2',
      title: 'Enable two-factor authentication (2FA)',
      description: 'Add a second layer of verification on all critical accounts.',
      category: 'personal',
      riskLevel: 'high',
      completed: false,
      tip: 'SMS-based 2FA is better than nothing, but app-based (TOTP) or hardware keys are much stronger.',
      howTo: 'Go to your account security settings, look for "Two-Factor Authentication" or "2-Step Verification," and set up an authenticator app like Google Authenticator or Authy.'
    },
    {
      id: 'p3',
      title: 'Review app permissions',
      description: 'Check which apps have access to your accounts and revoke unnecessary ones.',
      category: 'personal',
      riskLevel: 'medium',
      completed: false,
      tip: 'Third-party apps with access to your accounts can be a backdoor for attackers.',
      howTo: 'Visit the security settings of your Google, Microsoft, and social media accounts. Look for "Connected Apps" or "Third-party access" and remove anything you don\'t recognize.'
    },
    {
      id: 'p4',
      title: 'Set up account recovery options',
      description: 'Ensure you have backup codes and recovery methods configured.',
      category: 'personal',
      riskLevel: 'medium',
      completed: false,
      tip: 'Without recovery options, losing your 2FA device could lock you out permanently.',
      howTo: 'Download and securely store backup codes for your critical accounts. Set a recovery email and phone number that you control.'
    },
    {
      id: 'p5',
      title: 'Create regular data backups',
      description: 'Back up important files to an encrypted external drive or cloud service.',
      category: 'personal',
      riskLevel: 'high',
      completed: false,
      tip: 'Ransomware attacks are useless against you if you have clean backups.',
      howTo: 'Use the 3-2-1 rule: 3 copies of your data, on 2 different media types, with 1 stored offsite (cloud). Set up automatic backups on a weekly schedule.'
    },
    // Device Security
    {
      id: 'd1',
      title: 'Enable automatic OS updates',
      description: 'Keep your operating system up to date with the latest security patches.',
      category: 'device',
      riskLevel: 'high',
      completed: false,
      tip: 'Most exploits target known vulnerabilities that already have patches available.',
      howTo: 'Windows: Settings > Update & Security > Turn on automatic updates. Mac: System Preferences > Software Update > Enable automatic updates.'
    },
    {
      id: 'd2',
      title: 'Enable full-disk encryption',
      description: 'Encrypt your hard drive so data is unreadable if your device is lost or stolen.',
      category: 'device',
      riskLevel: 'high',
      completed: false,
      tip: 'An unencrypted stolen laptop gives an attacker full access to all your files.',
      howTo: 'Windows: Enable BitLocker via Control Panel > System and Security. Mac: Enable FileVault via System Preferences > Security & Privacy.'
    },
    {
      id: 'd3',
      title: 'Install and update antivirus software',
      description: 'Use reputable antivirus/anti-malware protection with real-time scanning.',
      category: 'device',
      riskLevel: 'medium',
      completed: false,
      tip: 'Windows Defender is solid for most users. Pair it with occasional Malwarebytes scans.',
      howTo: 'Ensure Windows Defender (or your chosen AV) is enabled and set to update definitions automatically. Run a full scan at least once a month.'
    },
    {
      id: 'd4',
      title: 'Set a strong lock screen password',
      description: 'Use a PIN, password, or biometric lock on all your devices.',
      category: 'device',
      riskLevel: 'medium',
      completed: false,
      tip: 'A 4-digit PIN has only 10,000 combinations. Use at least 6 digits or an alphanumeric password.',
      howTo: 'Go to your device settings > Security > Screen Lock and set a strong password or enable fingerprint/face recognition.'
    },
    {
      id: 'd5',
      title: 'Disable unnecessary services and ports',
      description: 'Turn off Bluetooth, AirDrop, and other services when not in use.',
      category: 'device',
      riskLevel: 'low',
      completed: false,
      tip: 'Open services are open attack surfaces. If you\'re not using it, turn it off.',
      howTo: 'Check your system settings for Bluetooth, file sharing, remote desktop, and AirDrop. Disable anything you don\'t actively use.'
    },
    // Network Security
    {
      id: 'n1',
      title: 'Change default router password',
      description: 'Replace the factory-set admin password on your router with a strong unique one.',
      category: 'network',
      riskLevel: 'high',
      completed: false,
      tip: 'Default router credentials are publicly available online for every manufacturer.',
      howTo: 'Access your router admin panel (usually 192.168.1.1 or 192.168.0.1), log in with the default credentials, and change both the admin password and Wi-Fi password.'
    },
    {
      id: 'n2',
      title: 'Use WPA3 or WPA2 encryption',
      description: 'Ensure your Wi-Fi network uses modern encryption, not WEP or open.',
      category: 'network',
      riskLevel: 'high',
      completed: false,
      tip: 'WEP encryption can be cracked in minutes. WPA3 is the current gold standard.',
      howTo: 'Log into your router settings, navigate to Wireless Security, and select WPA3-Personal (or WPA2-AES if WPA3 isn\'t available).'
    },
    {
      id: 'n3',
      title: 'Use a VPN on public Wi-Fi',
      description: 'Encrypt your internet traffic when connected to public or untrusted networks.',
      category: 'network',
      riskLevel: 'high',
      completed: false,
      tip: 'Public Wi-Fi is trivially easy to sniff. A VPN creates an encrypted tunnel for your traffic.',
      howTo: 'Subscribe to a reputable VPN service (Mullvad, ProtonVPN, or Wireguard-based). Install their app and connect before using any public Wi-Fi.'
    },
    {
      id: 'n4',
      title: 'Enable your firewall',
      description: 'Make sure your OS firewall is active and properly configured.',
      category: 'network',
      riskLevel: 'medium',
      completed: false,
      tip: 'A firewall is your first line of defense against unauthorized inbound connections.',
      howTo: 'Windows: Search "Windows Defender Firewall" and ensure it\'s on for all network profiles. Mac: System Preferences > Security & Privacy > Firewall > Turn On.'
    },
    {
      id: 'n5',
      title: 'Monitor connected devices',
      description: 'Regularly check what devices are connected to your home network.',
      category: 'network',
      riskLevel: 'low',
      completed: false,
      tip: 'Unknown devices on your network could mean someone has your Wi-Fi password.',
      howTo: 'Log into your router admin panel and check the connected devices list. Use an app like Fing to scan your network. Remove any devices you don\'t recognize.'
    }
  ];

  constructor() {
    this.loadProgress();
  }

  // --- Persistence ---
  private loadProgress(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const completedIds: string[] = JSON.parse(saved);
        this.checklistItems.forEach(item => {
          item.completed = completedIds.includes(item.id);
        });
      }
    } catch (e) {
      console.warn('Could not load saved progress:', e);
    }
  }

  private saveProgress(): void {
    try {
      const completedIds = this.checklistItems
        .filter(i => i.completed)
        .map(i => i.id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(completedIds));
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  }

  resetProgress(): void {
    this.checklistItems.forEach(item => item.completed = false);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // --- Getters ---
  getCategories(): CategoryInfo[] {
    return this.categories;
  }

  getChecklistItems(): ChecklistItem[] {
    return this.checklistItems;
  }

  getItemsByCategory(category: CategoryType): ChecklistItem[] {
    return this.checklistItems.filter(item => item.category === category);
  }

  toggleItem(id: string): void {
    const item = this.checklistItems.find(i => i.id === id);
    if (item) {
      item.completed = !item.completed;
      this.saveProgress();
    }
  }

  getOverallProgress(): number {
    const completed = this.checklistItems.filter(i => i.completed).length;
    return Math.round((completed / this.checklistItems.length) * 100);
  }

  getCategoryProgress(category: CategoryType): number {
    const items = this.getItemsByCategory(category);
    const completed = items.filter(i => i.completed).length;
    return Math.round((completed / items.length) * 100);
  }
}