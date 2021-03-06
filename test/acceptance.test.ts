import { expect } from 'chai';
import { resolve } from 'path';
import { ApplicationFixture, createBuilder, createTempDir, FixtureBuilder } from '../index';

describe('my-addon', function() {
  this.timeout(6000);

  it('builds everything', async () => {
    const app = new ApplicationFixture()
      .file('app/templates/application.hbs', '<h1>Hello World</h1>')
      .siblingAddon('addon-under-test')
      .build();

    const applicationFixture = new FixtureBuilder()
      .application(app)
      .build();

    const input = await createTempDir();

    const output = createBuilder(input.path());

    try {
      await input.installDependencies(
        resolve(__dirname, '../..'),
        { as: 'addon-under-test' }
      );
      input.write(applicationFixture);

      await output.build();

      const files = output.read();
      expect(Object.keys(files.assets)).to.deep.equal([
        'application.css',
        'application.js',
        'application.map',
        'vendor.css',
        'vendor.js',
        'vendor.map'
      ]);
      expect(files.assets['application.js']).to.include('Hello World');
    } catch {
      input.dispose();
      output.dispose();
    }
  });
});
