#!/usr/bin/env python3
"""
Fix circle messages — both repos
1. dream-os: GET /couple/circle/:id — join conversations, return conversation_id per member
2. dreamos-pwa: fetchCircleThreads — use conversation_id not member.id for thread_id
Drop each in respective repo root.
"""
import subprocess, sys, os

# ── Detect which repo we're in ────────────────────────────────────────────────
if os.path.exists('src/api/couple/circle.js'):
    repo = 'dream-os'
elif os.path.exists('lib/frost/journey.ts'):
    repo = 'dreamos-pwa'
else:
    print('ERROR: run from dream-os or dreamos-pwa repo root')
    sys.exit(1)

print(f'Detected repo: {repo}')

# ══════════════════════════════════════════════════════════════════════════════
# DREAM-OS FIX
# Update GET /couple/circle/:id to fetch conversation_id per member
# ══════════════════════════════════════════════════════════════════════════════
if repo == 'dream-os':
    PATH = 'src/api/couple/circle.js'
    with open(PATH) as f: src = f.read()

    OLD = """  // Active members
  const { data: members, error: mErr } = await supabase
    .from('circle_members')
    .select('id, invitee_name, role, status, joined_at, created_at')
    .eq('couple_id', couple_id)
    .eq('status', 'active')
    .order('joined_at', { ascending: true });

  if (mErr) {
    console.error('[GET /couple/circle] members error:', mErr.message);
    return errRes(res, 500, 'Could not fetch circle.');
  }"""

    NEW = """  // Active members
  const { data: members, error: mErr } = await supabase
    .from('circle_members')
    .select('id, invitee_name, invitee_phone, role, status, joined_at, created_at')
    .eq('couple_id', couple_id)
    .eq('status', 'active')
    .order('joined_at', { ascending: true });

  if (mErr) {
    console.error('[GET /couple/circle] members error:', mErr.message);
    return errRes(res, 500, 'Could not fetch circle.');
  }

  // Fetch conversation_id for each member via counterparty_phone match
  const { data: convos } = await supabase
    .from('conversations')
    .select('id, counterparty_phone, last_message_at')
    .eq('couple_id', couple_id)
    .eq('kind', 'circle_thread');

  const convoByPhone = {};
  (convos || []).forEach(c => {
    if (c.counterparty_phone) convoByPhone[c.counterparty_phone] = c;
  });"""

    if OLD not in src:
        print('ERROR: anchor not found in circle.js')
        sys.exit(1)
    src = src.replace(OLD, NEW, 1)

    # Update the members shape in the response to include conversation_id
    OLD2 = """  return okRes(res, {
    members:         members  || [],"""

    NEW2 = """  const shapedMembers = (members || []).map(m => {
    const convo = m.invitee_phone ? convoByPhone[m.invitee_phone] : null;
    return {
      id:              m.id,
      invitee_name:    m.invitee_name,
      role:            m.role,
      status:          m.status,
      joined_at:       m.joined_at,
      conversation_id: convo?.id || null,
      last_active:     convo?.last_message_at || m.joined_at || null,
    };
  });

  return okRes(res, {
    members:         shapedMembers,"""

    if OLD2 not in src:
        print('ERROR: response anchor not found in circle.js')
        sys.exit(1)
    src = src.replace(OLD2, NEW2, 1)

    with open(PATH, 'w') as f: f.write(src)
    print('Patched', PATH)
    result = subprocess.run(['node', '--check', PATH], capture_output=True, text=True)
    if result.returncode != 0:
        print('SYNTAX ERROR:', result.stderr)
        sys.exit(1)
    print('node --check PASS\n')
    print('Run next:')
    print('  git add src/api/couple/circle.js')
    print('  git commit -m "fix(couple-circle): return conversation_id per member for PWA thread linking"')
    print('  git push origin main')

# ══════════════════════════════════════════════════════════════════════════════
# DREAMOS-PWA FIX
# fetchCircleThreads: use member.conversation_id not member.id for thread_id
# ══════════════════════════════════════════════════════════════════════════════
elif repo == 'dreamos-pwa':
    PATH = 'lib/frost/journey.ts'
    with open(PATH) as f: src = f.read()

    OLD = """export async function fetchCircleThreads(): Promise<CircleThread[]> {
  if (USE_MOCKS) return delay(MOCK_CIRCLE_THREADS);
  const id = getCoupleId();
  // Same /couple/circle/:id call — shape active members as DM threads
  const r: any = await apiFetch(`/api/v2/couple/circle/${id}`);
  const members: any[] = r?.members ?? [];
  return members.map(m => ({
    thread_id:    `dm:${m.id}`,
    kind:         'dm' as const,
    label:        m.invitee_name || 'Circle member',
    role:         m.role         || null,
    last_message: null,
    last_active:  m.joined_at    || null,
  }));
}"""

    NEW = """export async function fetchCircleThreads(): Promise<CircleThread[]> {
  if (USE_MOCKS) return delay(MOCK_CIRCLE_THREADS);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/couple/circle/${id}`);
  const members: any[] = r?.members ?? [];
  // Use conversation_id (real conversations.id) not member.id for thread lookup
  // Only show members who have an active conversation (have sent at least one WA message)
  return members
    .filter(m => m.conversation_id)
    .map(m => ({
      thread_id:    `dm:${m.conversation_id}`,
      kind:         'dm' as const,
      label:        m.invitee_name || 'Circle member',
      role:         m.role         || null,
      last_message: null,
      last_active:  m.last_active  || m.joined_at || null,
    }));
}"""

    if OLD not in src:
        print('ERROR: anchor not found in journey.ts')
        sys.exit(1)
    src = src.replace(OLD, NEW, 1)

    with open(PATH, 'w') as f: f.write(src)
    print('Patched', PATH)

    result = subprocess.run(['npx', '--no-install', 'tsc', '--noEmit'], capture_output=True, text=True)
    if result.returncode != 0:
        print('TSC ERRORS:')
        print(result.stdout)
        sys.exit(1)
    print('tsc PASS\n')
    print('Run next:')
    print('  git add lib/frost/journey.ts')
    print('  git commit -m "fix(circle): use conversation_id not member.id for thread messages"')
    print('  git push origin main')
