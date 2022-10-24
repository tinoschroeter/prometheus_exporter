# backuppc_exporter

## Usage

### Textfile Collector

The textfile module is for metrics that are tied to a machine.

To use it, create files in this directory that are readable by the prometheus user.  
The collector will parse all files in matching the glob *.prom using the text format.

```bash
cat /etc/default/prometheus-node-exporter

# --collector.textfile.directory="/var/lib/prometheus/node-exporter"
# Directory to read text files with metrics from.

# --collector.textfile      
# Enable the textfile collector (default: enabled).
```

```bash
<collector_script> | sponge <output_file>
/opt/backuppc_exporter | sponge /var/lib/prometheus/node-exporter/backuppc.prom
```

```bash
# Sponge comes from moreutils
moreutils
```
### cron job

```bash
*/10 * * * * /opt/backuppc_exporter | sponge /var/lib/prometheus/node-exporter/backuppc.prom
```

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
