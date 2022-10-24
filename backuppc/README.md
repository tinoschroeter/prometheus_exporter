# backuppc_exporter

## Usage

Textfile Collector Scripts for the Node Exporter.


## Exposed metrics

> backuppc_last_age

```bash
# HELP backuppc_last_age Age of most recent backup for every host, in seconds.
# TYPE backuppc_last_age gauge
backuppc_last_age{hostname="cloud"} 55246
backuppc_last_age{hostname="main-node01"} 55227
backuppc_last_age{hostname="worker-node01"} 56253
backuppc_last_age{hostname="worker-node02"} 41585
backuppc_last_age{hostname="worker-node03"} 49872
```

> backuppc_pool_usage

```bash
# HELP backuppc_pool_usage BackupPC pool usage (0 to 100)
# TYPE backuppc_pool_usage gauge
backuppc_pool_usage 13
```

## Example Prometheus rules

```bash
  - alert: BackuppcPoolStatus
    expr: backuppc_pool_usage > 90
    for: 1m
    labels:
      severity: warning
    annotations:
      identifier: '{{ $labels.instance }}'
      description: The BackupPC pool of {{ $labels.instance }} is almost full.
      summary: The BackupPC pool of {{ $labels.instance }} is almost full.
```

```bash
  - alert: BackuppcAllBackupsOnTime
    expr: ceil(backuppc_last_age/86400) > 2
    for: 1m
    labels:
      severity: warning
    annotations:
      identifier: '{{ $labels.instance }}'
      description: 'Last backup of {{ $labels.hostname }} on {{ $labels.instance }} is more than {{ $value }} days old.'
      summary: Backup too old for {{ $labels.hostname }}.
```
