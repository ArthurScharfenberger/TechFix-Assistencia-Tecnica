import { createIcons, AlertCircle, AlertTriangle, ArrowRight, ArrowUpRight, Filter, Award, BadgeInfo, BarChart3, CalendarRange, CheckCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleCheck, CircleX, ClipboardList, Cpu, Crown, Currency, DollarSign, Download, Edit3, Eye, EyeOff, FileBarChart, FileDown, FileSearch, FileSpreadsheet, GraduationCap, Headphones, HelpCircle, Hourglass, Inbox, Info, Laptop, LayoutDashboard, LineChart, ListFilter, LoaderCircle, LockKeyhole, LogIn, LogOut, Menu, Moon, Plus, Printer, Receipt, RotateCcw, Search, Settings, Siren, Sparkles, Sun, Text, Ticket, Timer, Trash2, TrendingDown, TrendingUp, User, UserCheck, UserCog, UserPlus, UserX, Users, Wrench, X } from 'lucide';

const icons = { AlertCircle, AlertTriangle, ArrowRight, ArrowUpRight, Filter, Award, BadgeInfo, BarChart3, CalendarRange, CheckCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleCheck, CircleX, ClipboardList, Cpu, Crown, Currency, DollarSign, Download, Edit3, Eye, EyeOff, FileBarChart, FileDown, FileSearch, FileSpreadsheet, GraduationCap, Headphones, HelpCircle, Hourglass, Inbox, Info, Laptop, LayoutDashboard, LineChart, ListFilter, LoaderCircle, LockKeyhole, LogIn, LogOut, Menu, Moon, Plus, Printer, Receipt, RotateCcw, Search, Settings, Siren, Sparkles, Sun, Text, Ticket, Timer, Trash2, TrendingDown, TrendingUp, User, UserCheck, UserCog, UserPlus, UserX, Users, Wrench, X };

export function initIcons(container?: HTMLElement | Document): void {
  createIcons({
    icons,
    nameAttr: 'data-lucide',
    attrs: {
      class: 'lucide-icon',
      width: '18',
      height: '18',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    ...(container ? { root: container as HTMLElement } : {}),
  });
}

export function iconHTML(name: string, extraClass: string = '', size: number = 18): string {
  return `<i data-lucide="${name}" class="${extraClass}" style="width: ${size}px; height: ${size}px; display: inline-block; vertical-align: middle;"></i>`;
}
