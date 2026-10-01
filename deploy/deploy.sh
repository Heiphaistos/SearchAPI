#!/bin/bash
# Lance par /usr/local/sbin/deployer sur le VPS (minuteur deployer-auto).
# Site statique : nginx sert directement /opt/searchapi, rien a construire.
set -euo pipefail
echo "searchapi : fichiers a jour"
