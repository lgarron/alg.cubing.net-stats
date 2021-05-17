# PREFIX=/Users/lgarron/Backups/rsync/dreamhost_logs/lgarron/alg.cubing.net/https.30893003/access.log.
PREFIX=/Users/lgarron/Backups/rsync/dreamhost_logs/lgarron/alg.cubing.net/https.30893003/access.log.2021

.PHONY: parse
parse:
	mkdir -p results
	npx \
		ts-node \
		"/Users/lgarron/Code/git/github.com/cubing/alg.cubing.net-stats/src/main.ts" \
		${PREFIX}* \
		| tee "./results/results.txt"
