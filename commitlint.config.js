//-----------------------------------------------------------------------------------------------------------------------------------------------------
// build: Changes that affect the build system or external dependencies
// chore: Used for miscellaneous changes that don't affect the main codebase (e.g., configuring development tools, setting up project-specific settings)
// ci: Changes to our CI configuration files and scripts
// docs: Documentation only changes
// feat: A new feature
// fix: A bug fix
// update: Update something for a specific use case
// perf: A code change that improves performance
// refactor: A code change that neither fixes a bug nor adds a feature
// style: Changes that do not affect the meaning of the code (e.g., white-space, formatting, missing semi-colons)
// test: Adding missing tests or correcting existing tests
// translation: Changes related to translations or language localization
// sec: Changes that address security vulnerabilities, implement security measures, or enhance the overall security of the codebase
// -----------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    parserPreset: {
      parserOpts: {
        headerPattern: /^(\w+)(?:\((\w+)\))?:\s(.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
      },
    },
    plugins: [
      {
        rules: {
          'header-match-team-pattern': (parsed) => {
            const { type, subject } = parsed;
            const allowedTypes = [
              'build',
              'chore',
              'ci',
              'docs',
              'feat',
              'update',
              'fix',
              'perf',
              'refactor',
              'style',
              'test',
              'translation',
              'sec',
            ];
  
            if (!type || !subject) {
              return [
                false,
                "\x1b[31mERROR\x1b[0m: Please follow the format 'feat(auth): user login form' or 'fix: fixing data problems'",
              ];
            }
  
            if (!allowedTypes.includes(type)) {
              return [
                false,
                `\x1b[31mERROR\x1b[0m: The commit type '${type}' is not allowed. Allowed types are: [${allowedTypes.join(', ')}]`,
              ];
            }
  
            return [true, ''];
          },
        },
      },
    ],
    rules: {
      'header-match-team-pattern': [2, 'always'],
      'subject-empty': [2, 'never'],
      'body-leading-blank': [2, 'always'],
      'footer-leading-blank': [2, 'always'],
      'footer-empty': [2, 'always'],
    },
  };