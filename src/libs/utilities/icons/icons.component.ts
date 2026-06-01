import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-icons-demo',
  standalone: true,
  imports: [CommonModule, SdPageComponent, SdSection, SdInput, SdInputNumber],
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconsDemoComponent {
  pageDescription = signal<string>('Danh sách icon hệ thống dùng Google Material Icons, chia theo 2 nhóm chính: fill và outline.');

  searchText = signal<string>('');
  iconSize = signal<number>(24);
  copiedIcon = signal<string>('');

  readonly allIcons: string[] = [
    // Navigation & Layout
    'home', 'menu', 'close', 'arrow_back', 'arrow_forward', 'arrow_upward', 'arrow_downward',
    'chevron_left', 'chevron_right', 'expand_more', 'expand_less', 'unfold_more', 'unfold_less',
    'more_vert', 'more_horiz', 'apps', 'dashboard', 'grid_view', 'view_list', 'view_module',
    'first_page', 'last_page', 'navigate_before', 'navigate_next', 'subdirectory_arrow_right',
    'swap_horiz', 'swap_vert', 'drag_indicator', 'open_in_new', 'launch', 'fullscreen', 'fullscreen_exit',
    // Actions
    'search', 'add', 'remove', 'add_circle', 'remove_circle', 'edit', 'delete', 'delete_forever',
    'save', 'save_as', 'undo', 'redo', 'content_copy', 'content_paste', 'content_cut',
    'send', 'share', 'print', 'download', 'upload', 'cloud_upload', 'cloud_download',
    'refresh', 'sync', 'sync_alt', 'filter_list', 'filter_alt', 'sort', 'tune',
    'zoom_in', 'zoom_out', 'open_with', 'select_all', 'deselect', 'find_replace',
    // Status & Feedback
    'check', 'check_circle', 'done', 'done_all', 'done_outline',
    'error', 'warning', 'info', 'help', 'help_outline', 'report',
    'cancel', 'block', 'not_interested', 'do_not_disturb',
    'visibility', 'visibility_off', 'preview',
    'star', 'star_border', 'star_half', 'grade', 'thumb_up', 'thumb_down', 'favorite', 'favorite_border',
    // Files & Data
    'folder', 'folder_open', 'folder_shared', 'create_new_folder',
    'description', 'article', 'note', 'notes', 'sticky_note_2',
    'attachment', 'image', 'photo', 'photo_library', 'video_file', 'audio_file', 'picture_as_pdf',
    'table_chart', 'bar_chart', 'pie_chart', 'show_chart', 'trending_up', 'trending_down',
    'insert_drive_file', 'file_copy', 'snippet_folder', 'summarize',
    // People & Auth
    'person', 'person_add', 'person_remove', 'people', 'people_alt',
    'account_circle', 'manage_accounts', 'group', 'groups', 'supervisor_account',
    'lock', 'lock_open', 'login', 'logout', 'password', 'vpn_key', 'key',
    'verified_user', 'security', 'admin_panel_settings', 'policy',
    // Communication
    'mail', 'email', 'drafts', 'inbox', 'send', 'mark_email_read',
    'phone', 'phone_enabled', 'phone_disabled', 'call', 'voicemail',
    'message', 'chat', 'chat_bubble', 'forum', 'comment',
    'notifications', 'notifications_off', 'notifications_active', 'notifications_paused',
    'announcement', 'campaign', 'feedback',
    // Time & Calendar
    'schedule', 'access_time', 'access_alarm', 'alarm', 'alarm_on',
    'calendar_today', 'date_range', 'event', 'event_available', 'event_busy', 'history', 'update',
    // Settings & System
    'settings', 'settings_applications', 'build', 'construction', 'handyman',
    'code', 'data_object', 'terminal', 'bug_report', 'integration_instructions',
    'palette', 'color_lens', 'format_paint', 'brush', 'design_services',
    'developer_mode', 'api', 'webhook',
    // Finance & Business
    'payments', 'payment', 'account_balance', 'account_balance_wallet', 'savings',
    'money', 'attach_money', 'currency_exchange', 'price_check', 'discount',
    'shopping_cart', 'shopping_bag', 'inventory', 'inventory_2', 'warehouse',
    'receipt', 'receipt_long', 'request_quote', 'point_of_sale',
    'local_shipping', 'business', 'business_center', 'work', 'work_outline',
    'trending_up', 'leaderboard', 'analytics',
    // Location & Map
    'location_on', 'location_off', 'map', 'place', 'near_me', 'pin_drop', 'explore',
    'directions', 'navigation', 'my_location', 'public', 'language',
    // Device & UI
    'smartphone', 'laptop', 'computer', 'tablet', 'devices', 'desktop_windows',
    'mouse', 'keyboard', 'headphones', 'print', 'scanner',
    // Misc & Content
    'tag', 'label', 'label_off', 'bookmark', 'bookmark_border', 'bookmarks',
    'link', 'link_off', 'qr_code', 'qr_code_scanner', 'barcode',
    'format_list_bulleted', 'format_list_numbered', 'checklist',
    'source', 'topic', 'category', 'class', 'sell',
    'verified', 'new_releases', 'fiber_new', 'update', 'upgrade',
    'circle', 'square', 'pentagon', 'hexagon',
    'expand_circle_down', 'collapse', 'compress', 'open_in_full',
  ];

  fillIcons = this.allIcons;
  outlineIcons = this.allIcons;

  filteredFillIcons = computed(() => {
    const term = this.searchText().trim().toLowerCase();
    return term ? this.fillIcons.filter(icon => icon.toLowerCase().includes(term)) : this.fillIcons;
  });

  filteredOutlineIcons = computed(() => {
    const term = this.searchText().trim().toLowerCase();
    return term ? this.outlineIcons.filter(icon => icon.toLowerCase().includes(term)) : this.outlineIcons;
  });

  copyIcon(iconName: string): void {
    this.copiedIcon.set(iconName);

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(iconName).catch(() => {
        // ignore clipboard errors in restricted environments
      });
    }
  }
}
