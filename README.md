# hiera-eyaml

This extension adds support for running encrypt/decrypt commands within yaml files using hiera-eyaml. The hiera-eyaml gem is required to be installed.

## Features

### Encryption

- Allows for encrypting the currently selected data using the public key specified in your settings.
- Accessible via command palette or editor context menu as: *Encrypt selection with eyaml*
- Output format can be specified via settings as Block or String format. If using Block format, you may also set the line length to use when creating the block.
- Only a public key needs to be specified in the settings for encryption to work.

### Decryption

- Allows for decrypting the currently selected data using the public and private keys specified in your settings.
- Accessible via command palette or editor context menu as: *Decrypt selection with eyaml*
- Both a public and private key must be specified in the settings for decryption to work.

## Requirements
Ruby and the hiera-eyaml gem are required to be installed. The hiera-eyaml gem can be installed using this command: `gem install hiera-eyaml`

This extension has been tested with version 2.1.0 (https://rubygems.org/gems/hiera-eyaml/versions/2.1.0).

## Extension Settings

This extension contributes the following settings under `hiera-eyaml`:
* `eyamlPath`: Path to the eyaml command line utility.
* `publicKeyPath`: Path to the public key to use for encryption and decryption.
* `privateKeyPath`: Path to private key to use for decryption.
* `outputFormat`: Formatting to use for encrypted value (String or Block).
* `outputBlockSize`: Specifies the length of each line when using Block output format.

## Release Notes

### Version 1.0.1

* Decryption: fixed handling of spaces in block formatted encrypted data

### Version 1.0.0

* Initial release