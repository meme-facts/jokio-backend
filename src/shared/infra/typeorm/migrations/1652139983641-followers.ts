import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class followers1652139983641 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'followers',
                columns: [
                    {
                        name:'id',
                        type: 'uuid',
                        isPrimary:true
                    },
                    {
                        name: 'fStatus',
                        type: 'char',
                    },
                    {
                        name: 'requestedUserId',
                        type: 'uuid'
                    },
                    {
                        name: 'requesterUserId',
                        type: 'uuid'
                    }, 
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                    
                ],
                foreignKeys: [
                    {
                      name: 'FKUserFollowerRequested',
                      referencedTableName: 'users',
                      referencedColumnNames: ['id'],
                      columnNames: ['requestedUserId'],
                      onDelete: 'SET NULL',
                      onUpdate: 'SET NULL',
                    },
                    {
                      name: 'FKUserFollowerRequester',
                      referencedTableName: 'users',
                      referencedColumnNames: ['id'],
                      columnNames: ['requesterUserId'],
                      onDelete: 'SET NULL',
                      onUpdate: 'SET NULL',
                    }
                  ],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('followers')
    }

}
